import assert from "node:assert/strict";
import test from "node:test";
import {
  areAnswersCorrect,
  areMultiDropdownAnswersCorrect,
  prepareQuizQuestions
} from "../src/utils/quizUtils.js";
import {
  advanceErrorReview,
  assignReviewQuestionIds,
  createErrorReviewProgress,
  finishErrorReview,
  finishOriginalRound,
  getErrorReviewSummary,
  recordOriginalAnswer,
  recordReviewAnswer
} from "../src/utils/errorReview.js";
import {
  readErrorReviewEnabled,
  saveErrorReviewEnabled
} from "../src/utils/errorReviewPreferences.js";

function finishOriginalRoundWithAnswers(answers, { enabled = true } = {}) {
  let progress = createErrorReviewProgress({
    enabled,
    scoreableCount: answers.length
  });

  answers.forEach((isCorrect, index) => {
    progress = recordOriginalAnswer(progress, {
      questionId: `question-${index + 1}`,
      isCorrect
    });
  });

  return finishOriginalRound(progress);
}

function answerAndAdvance(progress, isCorrect) {
  progress = recordReviewAnswer(progress, {
    questionId: progress.activeReviewId,
    isCorrect
  });
  return advanceErrorReview(progress);
}

test("25 correct answers finish without opening the review queue", () => {
  const progress = finishOriginalRoundWithAnswers(Array(25).fill(true));

  assert.equal(progress.phase, "complete");
  assert.deepEqual(progress.reviewQueue, []);
  assert.equal(progress.activeReviewId, null);
  assert.deepEqual(progress.originalResult, {
    correctCount: 25,
    incorrectCount: 0,
    scoreableCount: 25,
    percentage: 100
  });
});

test("24 correct answers and one final error queue only that final question", () => {
  const answers = Array(25).fill(true);
  answers[24] = false;
  const progress = finishOriginalRoundWithAnswers(answers);

  assert.equal(progress.phase, "review");
  assert.deepEqual(progress.reviewQueue, ["question-25"]);
  assert.equal(progress.activeReviewId, "question-25");
});

test("22 correct answers and three errors queue each missed question once", () => {
  const answers = Array(25).fill(true);
  answers[4] = false;
  answers[14] = false;
  answers[24] = false;
  const progress = finishOriginalRoundWithAnswers(answers);

  assert.deepEqual(progress.reviewQueue, [
    "question-5",
    "question-15",
    "question-25"
  ]);
  assert.equal(new Set(progress.reviewQueue).size, 3);
});

test("incorrect review answers move to the tail without creating duplicates", () => {
  const progress = finishOriginalRoundWithAnswers([false, false, false]);
  const firstAttempt = recordReviewAnswer(progress, {
    questionId: "question-1",
    isCorrect: false
  });

  assert.deepEqual(firstAttempt.reviewQueue, [
    "question-2",
    "question-3",
    "question-1"
  ]);
  assert.deepEqual(advanceErrorReview(firstAttempt).activeReviewId, "question-2");

  const secondAttempt = answerAndAdvance(
    advanceErrorReview(firstAttempt),
    false
  );
  assert.deepEqual(secondAttempt.reviewQueue, [
    "question-3",
    "question-1",
    "question-2"
  ]);
  assert.equal(new Set(secondAttempt.reviewQueue).size, 3);
});

test("a sole pending question returns after an incorrect review answer", () => {
  let progress = finishOriginalRoundWithAnswers([false]);

  progress = recordReviewAnswer(progress, {
    questionId: "question-1",
    isCorrect: false
  });
  assert.deepEqual(progress.reviewQueue, ["question-1"]);

  progress = advanceErrorReview(progress);
  assert.equal(progress.phase, "review");
  assert.equal(progress.activeReviewId, "question-1");
  assert.equal(progress.activeAnswerRecorded, false);
  assert.equal(progress.reviewAttempts, 1);
});

test("all incorrect answers enter the queue once and leave it after correction", () => {
  let progress = finishOriginalRoundWithAnswers([false, false, false, false]);

  assert.deepEqual(progress.reviewQueue, [
    "question-1",
    "question-2",
    "question-3",
    "question-4"
  ]);

  while (progress.phase === "review") {
    progress = answerAndAdvance(progress, true);
  }

  assert.equal(progress.phase, "complete");
  assert.deepEqual(progress.reviewQueue, []);
  assert.equal(progress.correctedIds.length, 4);
  assert.equal(new Set(progress.correctedIds).size, 4);
});

test("correcting every error preserves the original score and finishes automatically", () => {
  const answers = [...Array(22).fill(true), false, false, false];
  let progress = finishOriginalRoundWithAnswers(answers);
  const originalResult = { ...progress.originalResult };

  while (progress.phase === "review") {
    progress = answerAndAdvance(progress, true);
  }

  const summary = getErrorReviewSummary(progress);
  assert.deepEqual(progress.originalResult, originalResult);
  assert.equal(summary.originalResult.correctCount, 22);
  assert.equal(summary.originalResult.percentage, 88);
  assert.equal(summary.afterReviewCorrectCount, 25);
  assert.equal(summary.afterReviewPercentage, 100);
  assert.equal(summary.errorsCorrected, 3);
  assert.equal(summary.errorsTotal, 3);
  assert.equal(summary.errorsPending, 0);
});

test("early finish reports corrected and pending errors independently", () => {
  let progress = finishOriginalRoundWithAnswers([
    ...Array(22).fill(true),
    false,
    false,
    false
  ]);
  progress = answerAndAdvance(progress, true);
  progress = recordReviewAnswer(progress, {
    questionId: progress.activeReviewId,
    isCorrect: true
  });
  progress = finishErrorReview(progress);

  const summary = getErrorReviewSummary(progress);
  assert.equal(progress.phase, "complete");
  assert.equal(summary.originalResult.correctCount, 22);
  assert.equal(summary.originalResult.percentage, 88);
  assert.equal(summary.afterReviewCorrectCount, 24);
  assert.equal(summary.afterReviewPercentage, 96);
  assert.equal(summary.errorsCorrected, 2);
  assert.equal(summary.errorsTotal, 3);
  assert.equal(summary.errorsPending, 1);
});

test("disabled review preserves the original result and never queues errors", () => {
  const progress = finishOriginalRoundWithAnswers([true, false], {
    enabled: false
  });

  assert.equal(progress.phase, "complete");
  assert.deepEqual(progress.reviewQueue, []);
  assert.equal(progress.originalResult.correctCount, 1);
  assert.equal(progress.originalResult.incorrectCount, 1);
});

test("unscored cards are excluded from the result and error queue", () => {
  let progress = createErrorReviewProgress({ enabled: true, scoreableCount: 1 });
  progress = recordOriginalAnswer(progress, {
    questionId: "scored-question",
    isCorrect: false
  });
  const beforeUnscored = progress;
  progress = recordOriginalAnswer(progress, {
    questionId: "unscored-question",
    isCorrect: false,
    isScored: false
  });

  assert.equal(progress, beforeUnscored);
  progress = finishOriginalRound(progress);
  assert.deepEqual(progress.reviewQueue, ["scored-question"]);
  assert.equal(progress.originalResult.scoreableCount, 1);
  assert.equal(progress.originalResult.incorrectCount, 1);
});

test("multiple-choice repaso uses the existing exact-set answer criterion", () => {
  const correctAnswers = ["A", "B"];
  const partialAnswerIsCorrect = areAnswersCorrect(["A"], correctAnswers);
  let progress = createErrorReviewProgress({ enabled: true, scoreableCount: 1 });
  progress = recordOriginalAnswer(progress, {
    questionId: "multiple-choice-question",
    isCorrect: partialAnswerIsCorrect
  });
  progress = finishOriginalRound(progress);

  assert.equal(partialAnswerIsCorrect, false);
  assert.deepEqual(progress.reviewQueue, ["multiple-choice-question"]);

  const fullAnswerIsCorrect = areAnswersCorrect(["B", "A"], correctAnswers);
  progress = recordReviewAnswer(progress, {
    questionId: "multiple-choice-question",
    isCorrect: fullAnswerIsCorrect
  });
  progress = advanceErrorReview(progress);

  assert.equal(fullAnswerIsCorrect, true);
  assert.equal(progress.phase, "complete");
  assert.equal(getErrorReviewSummary(progress).afterReviewCorrectCount, 1);
});

test("multi-dropdown repaso uses the existing option-identity answer criterion", () => {
  const items = [{
    id: "item-1",
    answer: "Same label",
    answerOptionId: "correct-option",
    options: [
      { id: "incorrect-option", text: "Same label" },
      { id: "correct-option", text: "Same label" }
    ]
  }];
  let progress = createErrorReviewProgress({ enabled: true, scoreableCount: 1 });
  progress = recordOriginalAnswer(progress, {
    questionId: "dropdown-question",
    isCorrect: areMultiDropdownAnswersCorrect(items, { "item-1": "incorrect-option" })
  });
  progress = finishOriginalRound(progress);

  assert.deepEqual(progress.reviewQueue, ["dropdown-question"]);
  progress = recordReviewAnswer(progress, {
    questionId: progress.activeReviewId,
    isCorrect: areMultiDropdownAnswersCorrect(items, { "item-1": "correct-option" })
  });
  progress = advanceErrorReview(progress);

  assert.equal(progress.phase, "complete");
  assert.equal(getErrorReviewSummary(progress).afterReviewCorrectCount, 1);
});

test("duplicate answer submissions do not affect original or review progress", () => {
  let progress = createErrorReviewProgress({ enabled: true, scoreableCount: 1 });
  progress = recordOriginalAnswer(progress, {
    questionId: "stable-question",
    isCorrect: false
  });
  assert.equal(
    recordOriginalAnswer(progress, {
      questionId: "stable-question",
      isCorrect: true
    }),
    progress
  );

  progress = finishOriginalRound(progress);
  const afterFirstReviewAnswer = recordReviewAnswer(progress, {
    questionId: "stable-question",
    isCorrect: false
  });
  assert.equal(
    recordReviewAnswer(afterFirstReviewAnswer, {
      questionId: "stable-question",
      isCorrect: true
    }),
    afterFirstReviewAnswer
  );
  assert.equal(afterFirstReviewAnswer.reviewAttempts, 1);
  assert.deepEqual(afterFirstReviewAnswer.reviewQueue, ["stable-question"]);
});

test("new sessions start without carrying review errors", () => {
  const finishedSession = finishOriginalRoundWithAnswers([false]);
  assert.deepEqual(finishedSession.reviewQueue, ["question-1"]);

  const newSession = createErrorReviewProgress({ enabled: true, scoreableCount: 1 });
  assert.equal(newSession.phase, "normal");
  assert.deepEqual(newSession.reviewQueue, []);
  assert.deepEqual(newSession.originalIncorrectIds, []);
});

test("review IDs stay with questions and shuffled correctness/justifications", () => {
  const questions = assignReviewQuestionIds([
    {
      id: "image-question",
      type: "single_choice",
      question: "Image prompt",
      image: "data:image/png;base64,example",
      options: [
        { id: "correct", letter: "A", text: "Repeated", isCorrect: true, justification: "Correct reason" },
        { id: "incorrect", letter: "B", text: "Repeated", isCorrect: false, justification: "Incorrect reason" }
      ],
      answers: ["A"]
    },
    {
      id: "dropdown-question",
      type: "multi_dropdown",
      question: "Dropdown prompt",
      items: [{
        id: "item-1",
        answerOptionId: "right-option",
        options: [
          { id: "wrong-option", text: "No", justification: "Wrong" },
          { id: "right-option", text: "Yes", justification: "Right" }
        ]
      }]
    }
  ]);
  const previousRandom = Math.random;
  Math.random = () => 0;
  let prepared;
  try {
    prepared = prepareQuizQuestions(questions, questions.length);
  } finally {
    Math.random = previousRandom;
  }

  const imageQuestion = prepared.find((question) => question.reviewId === "image-question");
  const correctOption = imageQuestion.options.find((option) => option.isCorrect);
  const dropdownQuestion = prepared.find((question) => question.reviewId === "dropdown-question");
  const rightDropdownOption = dropdownQuestion.items[0].options.find(
    (option) => option.id === "right-option"
  );

  assert.equal(imageQuestion.image, "data:image/png;base64,example");
  assert.equal(correctOption.id, "correct");
  assert.equal(correctOption.justification, "Correct reason");
  assert.ok(imageQuestion.answers.includes(correctOption.letter));
  assert.equal(rightDropdownOption.justification, "Right");
  assert.equal(dropdownQuestion.items[0].answerOptionId, "right-option");
});

test("duplicate source IDs are made unique for use as review queue keys", () => {
  const questions = assignReviewQuestionIds([
    { id: "duplicate" },
    { id: "duplicate" }
  ]);

  assert.notEqual(questions[0].reviewId, questions[1].reviewId);
  assert.equal(new Set(questions.map((question) => question.reviewId)).size, 2);
});

test("review preference defaults on and persists its last value", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };

  assert.equal(readErrorReviewEnabled(storage), true);
  saveErrorReviewEnabled(false, storage);
  assert.equal(readErrorReviewEnabled(storage), false);
  saveErrorReviewEnabled(true, storage);
  assert.equal(readErrorReviewEnabled(storage), true);
});
