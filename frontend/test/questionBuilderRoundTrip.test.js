import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { Buffer } from "node:buffer";
import {
  buildQuestionText,
  builderQuestionToQuizQuestion,
  createQuestionsDocx,
  convertProcessedQuestionToBuilderQuestion
} from "../src/utils/questionBuilderUtils.js";
import {
  areAnswersCorrect,
  areMultiDropdownAnswersCorrect,
  prepareQuizQuestions
} from "../src/utils/quizUtils.js";
import {
  readJustificationsEnabled,
  saveJustificationsEnabled
} from "../src/utils/justificationPreferences.js";

const require = createRequire(import.meta.url);
const { parseHtmlToQuestions, convertWordToJson } = require("../../backend/src/services/wordToJson.service.js");

function parseBuilderText(text) {
  const html = text
    .split("\n")
    .map((line) => `<p>${line || " "}</p>`)
    .join("");
  return parseHtmlToQuestions(html).questions[0];
}

test("single choice keeps per-option explanations through preview text and import", () => {
  const question = {
    type: "single_choice",
    title: "Which one?",
    options: [
      { text: "HTTP", correct: true, justification: "Uses TCP.\nPort 80." },
      { text: "DNS", correct: false, justification: "Usually uses port 53." }
    ]
  };
  const imported = parseBuilderText(buildQuestionText(question, 0));

  assert.equal(imported.options[0].justification, "Uses TCP.\nPort 80.");
  assert.equal(imported.options[1].justification, "Usually uses port 53.");
  assert.equal(imported.options[0].isCorrect, true);
});

test("true/false import and export keeps both independent explanations", () => {
  const question = {
    type: "true_false",
    title: "DNS uses port 53.",
    trueFalseAnswer: "Verdadero",
    trueFalseJustifications: {
      Verdadero: "Correct statement.",
      Falso: "Choosing false is incorrect."
    }
  };
  const imported = parseBuilderText(buildQuestionText(question, 0));
  const builderQuestion = convertProcessedQuestionToBuilderQuestion({
    type: imported.type,
    question: imported.question,
    options: imported.options.map((option, index) => ({
      ...option,
      letter: String.fromCharCode(65 + index)
    })),
    answers: imported.options.filter((option) => option.isCorrect).map((_, index) => String.fromCharCode(65 + index))
  });

  assert.equal(builderQuestion.trueFalseJustifications.Verdadero, "Correct statement.");
  assert.equal(builderQuestion.trueFalseJustifications.Falso, "Choosing false is incorrect.");
  assert.equal(builderQuestion.trueFalseAnswer, "Verdadero");
});

test("multi-dropdown alternatives keep their own explanation and answer identity", () => {
  const question = {
    type: "multi_dropdown",
    title: "Complete:",
    items: [
      {
        text: "DNS uses",
        options: [
          { id: "tcp", text: "TCP", justification: "Not expected." },
          { id: "udp", text: "UDP", justification: "Correct here." },
          { id: "both", text: "Both", justification: "Not this answer." }
        ],
        answerOptionId: "udp",
        correctAnswer: "UDP"
      }
    ]
  };
  const imported = parseBuilderText(buildQuestionText(question, 0));
  const builderQuestion = convertProcessedQuestionToBuilderQuestion({
    type: "multi_dropdown",
    question: imported.question,
    items: imported.items
  });
  const quizQuestion = builderQuestionToQuizQuestion(builderQuestion);

  assert.equal(imported.items[0].options[1].justification, "Correct here.");
  assert.equal(builderQuestion.items[0].answerOptionId, imported.items[0].answerOptionId);
  assert.equal(quizQuestion.items[0].answerOptionId, imported.items[0].answerOptionId);
});

test("exported DOCX reimports with explanations for supported question types", async () => {
  const questions = [
    {
      type: "true_false",
      title: "DNS uses port 53.",
      trueFalseAnswer: "Verdadero",
      trueFalseJustifications: {
        Verdadero: "DNS normally uses port 53.",
        Falso: "The statement is correct."
      }
    },
    {
      type: "single_choice",
      title: "Which protocol uses TCP port 80?",
      options: [
        { text: "HTTP", correct: true, justification: "It uses TCP.\nIts usual port is 80." },
        { text: "DNS", correct: false, justification: "DNS usually uses port 53." }
      ]
    },
    {
      type: "multi_dropdown",
      title: "Complete:",
      items: [
        {
          text: "DNS uses",
          options: [
            { id: "tcp", text: "TCP", justification: "Not this one." },
            { id: "udp", text: "UDP", justification: "Correct option." },
            { id: "both", text: "Both", justification: "Not expected." }
          ],
          answerOptionId: "udp",
          correctAnswer: "UDP"
        }
      ]
    }
  ];
  const blob = await createQuestionsDocx(questions);
  const result = await convertWordToJson(
    Buffer.from(await blob.arrayBuffer()),
    { shuffle: false }
  );

  assert.equal(result.total, 3);
  assert.equal(result.justificationCount, 7);
  assert.equal(result.questions[0].options[1].justification, "The statement is correct.");
  assert.equal(result.questions[1].options[0].justification, "It uses TCP.\nIts usual port is 80.");
  assert.equal(result.questions[2].items[0].options[1].justification, "Correct option.");
  assert.equal(result.questions[2].items[0].answerOptionId, "item-1-option-2");
});

test("frontend shuffle keeps correctness and reasons together for duplicate text", () => {
  const question = {
    type: "single_choice",
    question: "Duplicate labels",
    options: [
      { id: "right", letter: "A", text: "Same", isCorrect: true, justification: "Right reason" },
      { id: "wrong", letter: "B", text: "Same", isCorrect: false, justification: "Wrong reason" }
    ],
    answers: ["A"]
  };
  const previousRandom = Math.random;
  Math.random = () => 0;
  const shuffled = prepareQuizQuestions([question], 1)[0];
  Math.random = previousRandom;
  const correct = shuffled.options.find((option) => option.isCorrect);

  assert.equal(correct.id, "right");
  assert.equal(correct.letter, "B");
  assert.equal(correct.justification, "Right reason");
  assert.deepEqual(shuffled.answers, ["B"]);
  assert.equal(areAnswersCorrect(["B"], shuffled.answers), true);
});

test("multi-dropdown answer checks use option identity when labels repeat", () => {
  const item = {
    id: 1,
    answer: "Same",
    answerOptionId: "right",
    options: [
      { id: "wrong", text: "Same" },
      { id: "right", text: "Same" }
    ]
  };

  assert.equal(areMultiDropdownAnswersCorrect([item], { 1: "right" }), true);
  assert.equal(areMultiDropdownAnswersCorrect([item], { 1: "wrong" }), false);
});

test("legacy dropdown values remain valid without option IDs", () => {
  const item = {
    id: 2,
    options: ["Verdadero", "Falso"],
    answer: "Falso"
  };

  assert.equal(areMultiDropdownAnswersCorrect([item], { 2: "2-option-2" }), true);
  assert.equal(areMultiDropdownAnswersCorrect([item], { 2: "2-option-1" }), false);
});

test("justification preference defaults to on and persists off across reloads", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };

  assert.equal(readJustificationsEnabled(storage), true);
  saveJustificationsEnabled(false, storage);
  assert.equal(readJustificationsEnabled(storage), false);
  saveJustificationsEnabled(true, storage);
  assert.equal(readJustificationsEnabled(storage), true);
});
