import { Document, ImageRun, Packer, Paragraph, TextRun } from "docx";

export const QUESTION_TYPES = {
  true_false: { label: "Verdadero / Falso", marker: "@" },
  single_choice: { label: "Opción única", marker: "@@" },
  multiple_choice: { label: "Opción múltiple", marker: "@@@" },
  multi_dropdown: { label: "Varios desplegables", marker: "@@@@" }
};

const EMPTY_OPTIONS = [
  { text: "", correct: false, justification: "" },
  { text: "", correct: false, justification: "" },
  { text: "", correct: false, justification: "" },
  { text: "", correct: false, justification: "" }
];

const EMPTY_ITEMS = [
  {
    text: "",
    options: [
      { id: "option-1", text: "Verdadero", justification: "" },
      { id: "option-2", text: "Falso", justification: "" }
    ],
    answerOptionId: "option-1",
    correctAnswer: "Verdadero"
  }
];

export function getOptionLetter(index) {
  return String.fromCharCode(97 + index);
}

export function getTypeLabel(type) {
  return QUESTION_TYPES[type]?.label || "Pregunta";
}

export function getTypeMarker(type) {
  return QUESTION_TYPES[type]?.marker || "@@";
}

export function createEmptyForm(type = "single_choice") {
  return {
    type,
    title: "",
    hasImage: false,
    imagePreview: null,
    trueFalseAnswer: "Verdadero",
    trueFalseJustifications: { Verdadero: "", Falso: "" },
    options: EMPTY_OPTIONS.map((option) => ({ ...option })),
    items: EMPTY_ITEMS.map((item) => ({
      ...item,
      options: item.options.map((option) => ({ ...option }))
    }))
  };
}

function normalizeDropdownOptions(item) {
  if (!Array.isArray(item.options)) return [];

  return item.options.map((option, index) => {
    if (typeof option === "string") {
      return {
        id: `option-${index + 1}`,
        text: option,
        justification: ""
      };
    }

    return {
      id: option.id || `option-${index + 1}`,
      text: option.text || "",
      justification: option.justification || ""
    };
  });
}

function getAnswerOptionId(item, options) {
  if (item.answerOptionId) return item.answerOptionId;
  const answerText = item.answer ?? item.correctAnswer;
  const matchingOption = options.find((option) => option.text === answerText);
  return matchingOption?.id || options[0]?.id || "";
}

export function normalizeQuestionForEdit(question) {
  const baseForm = {
    ...createEmptyForm(question.type),
    title: question.title || question.question || "",
    hasImage: Boolean(question.hasImage),
    imagePreview: question.imagePreview || question.image || null
  };

  if (question.type === "true_false") {
    return {
      ...baseForm,
      trueFalseAnswer: question.trueFalseAnswer || "Verdadero",
      trueFalseJustifications: {
        Verdadero: question.trueFalseJustifications?.Verdadero || "",
        Falso: question.trueFalseJustifications?.Falso || ""
      }
    };
  }

  if (question.type === "multi_dropdown") {
    return {
      ...baseForm,
      items: question.items.map((item) => {
        const options = normalizeDropdownOptions(item);
        return {
          text: item.text || "",
          options,
          answerOptionId: getAnswerOptionId(item, options),
          correctAnswer: item.correctAnswer || item.answer || ""
        };
      })
    };
  }

  return {
    ...baseForm,
    options: question.options.map((option) => ({
      ...option,
      justification: option.justification || ""
    }))
  };
}

function appendJustificationText(lines, marker, justification) {
  const text = (justification || "").trim();
  if (!text) return;
  lines.push(marker, ...text.split(/\r?\n/), "[[FIN_JUSTIFICACION]]");
}

export function buildQuestionText(question, index) {
  const marker = getTypeMarker(question.type);
  const lines = [`${marker} ${index + 1}. ${question.title}`];

  if (question.hasImage) lines.push("", "[[IMAGEN]]");

  if (question.type === "true_false") {
    ["Verdadero", "Falso"].forEach((answer, answerIndex) => {
      const correctMark = question.trueFalseAnswer === answer ? " *" : "";
      lines.push(`${getOptionLetter(answerIndex)}) ${answer}${correctMark}`);
      appendJustificationText(
        lines,
        "[[JUSTIFICACION]]",
        question.trueFalseJustifications?.[answer]
      );
      if (answerIndex === 0) lines.push("");
    });
    return lines.join("\n").trim();
  }

  if (question.type === "multi_dropdown") {
    question.items.forEach((item, itemIndex) => {
      const answerId = getAnswerOptionId(item, item.options || []);
      const options = normalizeDropdownOptions(item);
      const optionsText = options
        .map((option) => {
          const isCorrect =
            option.id === answerId ||
            (!item.answerOptionId && option.text === item.correctAnswer);
          return `${option.text}${isCorrect ? "*" : ""}`;
        })
        .join(" / ");
      lines.push(`${itemIndex + 1}) ${item.text} [${optionsText}]`);

      options.forEach((option, optionIndex) => {
        appendJustificationText(
          lines,
          `[[JUSTIFICACION_ITEM_${itemIndex + 1}_OPCION_${optionIndex + 1}]]`,
          option.justification
        );
      });

      if (itemIndex < question.items.length - 1) lines.push("");
    });
    return lines.join("\n").trim();
  }

  question.options.forEach((option, optionIndex) => {
    if (!option.text.trim()) return;
    const correctMark = option.correct ? " *" : "";
    lines.push(`${getOptionLetter(optionIndex)}) ${option.text}${correctMark}`);
    appendJustificationText(
      lines,
      "[[JUSTIFICACION]]",
      option.justification
    );
    if (optionIndex < question.options.length - 1) lines.push("");
  });

  return lines.join("\n").trim();
}

export function convertProcessedQuestionToBuilderQuestion(
  processedQuestion,
  warnings = []
) {
  const hasImage = Boolean(processedQuestion.hasImage || processedQuestion.image);
  const invalidJustifications = warnings.map((warning) => ({
    type: warning.type,
    option: warning.option,
    itemId: warning.itemId,
    itemIndex:
      warning.itemId == null
        ? undefined
        : processedQuestion.items?.findIndex((item) => item.id === warning.itemId),
    optionIndex: warning.optionIndex
  }));
  const base = {
    type: processedQuestion.type,
    title: processedQuestion.question,
    hasImage,
    imagePreview: processedQuestion.image || null,
    invalidJustifications
  };

  if (processedQuestion.type === "true_false") {
    const correctOption = processedQuestion.options.find(
      (option) => option.isCorrect ?? processedQuestion.answers.includes(option.letter)
    );

    return {
      ...base,
      trueFalseAnswer: correctOption?.text || "Verdadero",
      trueFalseJustifications: Object.fromEntries(
        processedQuestion.options.map((option) => [
          option.text,
          option.justification || ""
        ])
      )
    };
  }

  if (processedQuestion.type === "multi_dropdown") {
    return {
      ...base,
      items: processedQuestion.items.map((item) => ({
        text: item.text,
        options: normalizeDropdownOptions(item),
        answerOptionId: getAnswerOptionId(item, normalizeDropdownOptions(item)),
        correctAnswer: item.answer
      }))
    };
  }

  return {
    ...base,
    options: processedQuestion.options.map((option) => ({
      id: option.id,
      text: option.text,
      correct: option.isCorrect ?? processedQuestion.answers.includes(option.letter),
      justification: option.justification || ""
    }))
  };
}

export function builderQuestionToQuizQuestion(question) {
  const title = question.title;
  const common = {
    type: question.type,
    question: title,
    hasImage: question.hasImage,
    image: question.imagePreview || null
  };

  if (question.type === "true_false") {
    const options = ["Verdadero", "Falso"].map((text, index) => ({
      id: `true-false-${index + 1}`,
      letter: getOptionLetter(index).toUpperCase(),
      text,
      isCorrect: question.trueFalseAnswer === text,
      justification: question.trueFalseJustifications?.[text] || ""
    }));

    return {
      ...common,
      options,
      answers: options.filter((option) => option.isCorrect).map((option) => option.letter)
    };
  }

  if (question.type === "multi_dropdown") {
    const items = question.items.map((item, itemIndex) => {
      const options = normalizeDropdownOptions(item).map((option, optionIndex) => ({
        ...option,
        isCorrect:
          option.id === getAnswerOptionId(item, item.options || []) ||
          (!item.answerOptionId && option.text === item.correctAnswer),
        id: option.id || `item-${itemIndex + 1}-option-${optionIndex + 1}`
      }));
      const answer = options.find((option) => option.isCorrect);

      return {
        id: itemIndex + 1,
        text: item.text,
        options,
        answer: answer?.text || item.correctAnswer,
        answerOptionId: answer?.id || getAnswerOptionId(item, item.options || [])
      };
    });

    return { ...common, items };
  }

  const options = question.options.map((option, index) => ({
    id: option.id || `option-${index + 1}`,
    letter: getOptionLetter(index).toUpperCase(),
    text: option.text,
    isCorrect: Boolean(option.correct),
    justification: option.justification || ""
  }));

  return {
    ...common,
    options,
    answers: options.filter((option) => option.isCorrect).map((option) => option.letter)
  };
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let index = 0; index < binaryString.length; index += 1) {
    bytes[index] = binaryString.charCodeAt(index);
  }

  return bytes;
}

function createTextParagraph(text, bold = false) {
  return new Paragraph({ children: [new TextRun({ text, bold })] });
}

function createEmptyParagraph() {
  return new Paragraph({ children: [new TextRun("")] });
}

function createImageParagraph(imageDataUrl) {
  return new Paragraph({
    children: [
      new ImageRun({
        data: dataUrlToUint8Array(imageDataUrl),
        transformation: { width: 360, height: 260 }
      })
    ]
  });
}

function buildDocxParagraphs(questions) {
  const paragraphs = [];

  questions.forEach((question, index) => {
    const lines = buildQuestionText(question, index).split("\n");
    lines.forEach((line, lineIndex) => {
      paragraphs.push(createTextParagraph(line, lineIndex === 0));
      if (
        line === "[[IMAGEN]]" &&
        question.imagePreview?.startsWith("data:image")
      ) {
        paragraphs.push(createImageParagraph(question.imagePreview));
      }
    });
    paragraphs.push(createEmptyParagraph());
  });

  return paragraphs;
}

export async function createQuestionsDocx(questions) {
  const document = new Document({
    sections: [{ properties: {}, children: buildDocxParagraphs(questions) }]
  });
  return Packer.toBlob(document);
}

export async function exportQuestionsToDocx(questions) {
  const blob = await createQuestionsDocx(questions);
  downloadBlob(blob, "preguntas-joyacards.docx");
}
