const mammoth = require("mammoth");
const cheerio = require("cheerio");

const OPTION_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const JUSTIFICATION_START = "[[JUSTIFICACION]]";
const JUSTIFICATION_END = "[[FIN_JUSTIFICACION]]";
const ITEM_JUSTIFICATION_PATTERN = /^\[\[JUSTIFICACION_ITEM_(\d+)_OPCION_(\d+)\]\]$/i;

const QUESTION_TYPES = {
  "@": "true_false",
  "@@": "single_choice",
  "@@@": "multiple_choice",
  "@@@@": "multi_dropdown",
  "@@@@@": "drag_words"
};

function shuffleArray(array) {
  const shuffled = [...array];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index]
    ];
  }

  return shuffled;
}

function normalizeWordText(rawText) {
  return rawText
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/(@{1,5}\s*\d+[\).]\s*)/g, "\n$1")
    .replace(/(^|[\n\r\t\s:;])([a-zA-Z]\)\s*)/g, "$1\n$2")
    .replace(/(^|[\n\r\t\s])(\d+\)\s*)/g, "$1\n$2");
}

function getLines(rawText) {
  return normalizeWordText(rawText)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function getTextWithLineBreaks(node) {
  if (node.type === "text") return node.data || "";
  if (node.name === "br") return "\n";
  return (node.children || []).map(getTextWithLineBreaks).join("");
}

function getQuestionTypeFromMarker(marker) {
  return QUESTION_TYPES[marker] || "single_choice";
}

function parseQuestionLine(line) {
  const typedQuestionMatch = line.match(/^(@{1,5})\s*(\d+)[\).]\s*(.+)$/);

  if (typedQuestionMatch) {
    return {
      type: getQuestionTypeFromMarker(typedQuestionMatch[1]),
      question: typedQuestionMatch[3].trim(),
      sourceNumber: Number(typedQuestionMatch[2])
    };
  }

  const numberedQuestionMatch = line.match(/^(\d+)[\).]\s*(.+)$/);

  if (numberedQuestionMatch) {
    return {
      type: "single_choice",
      question: numberedQuestionMatch[2].trim(),
      sourceNumber: Number(numberedQuestionMatch[1])
    };
  }

  return null;
}

function isImageMarker(line) {
  return line.trim().toUpperCase() === "[[IMAGEN]]";
}

function parseOptionLine(line) {
  const optionMatch = line.match(/^([a-zA-Z])\)\s*(.+)$/);

  if (!optionMatch) return null;

  let text = optionMatch[2].trim();
  const isCorrect = text.endsWith("*");

  if (isCorrect) {
    text = text.slice(0, -1).trim();
  }

  return {
    text,
    isCorrect,
    sourceLetter: optionMatch[1].toUpperCase()
  };
}

function parseMultiDropdownLine(line) {
  const match = line.match(/^(\d+)\)\s*(.+?)\s*\[(.+)\]$/);

  if (!match) return null;

  const id = Number(match[1]);
  const text = match[2].trim();
  const options = match[3]
    .split("/")
    .map((rawOption) => rawOption.trim())
    .filter(Boolean)
    .map((rawOption, index) => {
      const isCorrect = rawOption.endsWith("*");
      const optionText = isCorrect
        ? rawOption.slice(0, -1).trim()
        : rawOption;

      return {
        id: `item-${id}-option-${index + 1}`,
        text: optionText,
        isCorrect,
        justification: ""
      };
    });

  const answerOption = options.find((option) => option.isCorrect);

  if (!answerOption || !text || options.length === 0) return null;

  return {
    id,
    text,
    options,
    answer: answerOption.text,
    answerOptionId: answerOption.id
  };
}

function createQuestion(type, question, sourceNumber, ordinal) {
  return {
    type,
    question,
    sourceNumber: sourceNumber || ordinal,
    sourceIndex: ordinal - 1,
    hasImage: false,
    image: null,
    options: [],
    answers: [],
    items: []
  };
}

async function convertWordToHtml(fileBuffer) {
  const result = await mammoth.convertToHtml(
    {
      buffer: fileBuffer
    },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        const imageBuffer = await image.read("base64");

        return {
          src: `data:${image.contentType};base64,${imageBuffer}`
        };
      })
    }
  );

  return result.value;
}

function processImage(imageSrc, state) {
  if (!imageSrc) return;

  if (state.pendingImageQuestion) {
    state.pendingImageQuestion.image = imageSrc;
    state.pendingImageQuestion.hasImage = true;
    state.pendingImageQuestion = null;
    return;
  }

  if (state.currentQuestion && !state.currentQuestion.image) {
    state.currentQuestion.image = imageSrc;
    state.currentQuestion.hasImage = true;
  }
}

function addWarning(state, type, target = null) {
  const linkedTarget = target?.target || target;
  const question = linkedTarget?.question || target?.question || state.currentQuestion;

  state.warnings.push({
    type,
    questionNumber: question?.sourceNumber || state.nextQuestionOrdinal,
    sourceIndex: question?.sourceIndex ?? Math.max(state.nextQuestionOrdinal - 1, 0),
    option:
      linkedTarget?.option?.sourceLetter || linkedTarget?.optionLabel || undefined,
    itemId: linkedTarget?.itemId,
    optionIndex: linkedTarget?.optionIndex
  });
}

function resolveItemTarget(question, itemNumber, optionNumber) {
  const item = question?.items.find((candidate) => candidate.id === itemNumber);
  const option = item?.options[optionNumber - 1];

  if (!item || !option) return null;

  return {
    question,
    option,
    itemId: item.id,
    optionIndex: optionNumber - 1
  };
}

function findTargetForOpeningMarker(line, state) {
  const explicitTarget = line.match(ITEM_JUSTIFICATION_PATTERN);

  if (explicitTarget) {
    const target = resolveItemTarget(
      state.currentQuestion,
      Number(explicitTarget[1]),
      Number(explicitTarget[2])
    );

    return {
      target,
      targetError: target ? null : "justification_target_not_found"
    };
  }

  if (line.toUpperCase() !== JUSTIFICATION_START) {
    return { target: null, targetError: null };
  }

  if (state.currentQuestion?.type === "drag_words") {
    return { target: null, targetError: "unsupported_justification_type" };
  }

  if (state.currentQuestion?.type === "multi_dropdown") {
    return { target: null, targetError: "justification_target_not_found" };
  }

  return {
    target: state.lastOptionTarget,
    targetError: state.lastOptionTarget
      ? null
      : "justification_target_not_found"
  };
}

function hasQuestionContent(question) {
  if (!question) return false;
  if (question.type === "multi_dropdown") return question.items.length > 0;
  if (question.type === "drag_words") return Boolean(question.question);
  return question.options.length > 0;
}

function finishOpenBlockAsInvalid(state) {
  if (!state.justificationBlock) return;
  addWarning(state, "unclosed_justification", state.justificationBlock);
  state.justificationBlock = null;
}

function applyJustificationBlock(state) {
  const block = state.justificationBlock;
  state.justificationBlock = null;

  if (!block.target) {
    addWarning(state, block.targetError || "justification_target_not_found", block);
    return;
  }

  const justification = block.lines.join("\n").trim();
  if (!justification) return;

  if (block.target.option.justification.trim()) {
    addWarning(state, "duplicate_justification", block.target);
    return;
  }

  block.target.option.justification = justification;
}

function processTextLine(line, state) {
  const normalizedLine = line.toUpperCase();

  if (state.justificationBlock) {
    if (normalizedLine === JUSTIFICATION_END) {
      applyJustificationBlock(state);
      return;
    }

    if (
      normalizedLine === JUSTIFICATION_START ||
      ITEM_JUSTIFICATION_PATTERN.test(line)
    ) {
      finishOpenBlockAsInvalid(state);
      processTextLine(line, state);
      return;
    }

    if (parseQuestionLine(line)) {
      finishOpenBlockAsInvalid(state);
      processTextLine(line, state);
      return;
    }

    if (
      parseOptionLine(line) ||
      (state.currentQuestion?.type === "multi_dropdown" &&
        parseMultiDropdownLine(line))
    ) {
      finishOpenBlockAsInvalid(state);
      processTextLine(line, state);
      return;
    }

    state.justificationBlock.lines.push(line);
    return;
  }

  if (normalizedLine === JUSTIFICATION_END) {
    addWarning(state, "unexpected_justification_end");
    return;
  }

  if (
    normalizedLine === JUSTIFICATION_START ||
    ITEM_JUSTIFICATION_PATTERN.test(line)
  ) {
    const { target, targetError } = findTargetForOpeningMarker(line, state);
    state.justificationBlock = {
      question: target?.question || state.currentQuestion,
      target,
      targetError,
      lines: []
    };
    return;
  }

  if (isImageMarker(line)) {
    if (state.currentQuestion) {
      state.currentQuestion.hasImage = true;
      state.pendingImageQuestion = state.currentQuestion;
    }

    state.lastOptionTarget = null;
    return;
  }

  if (state.currentQuestion?.type === "multi_dropdown") {
    const item = parseMultiDropdownLine(line);

    if (item) {
      state.currentQuestion.items.push(item);
      state.lastOptionTarget = null;
      return;
    }
  }

  const questionData = parseQuestionLine(line);

  if (questionData) {
    if (
      state.pendingImageQuestion &&
      state.pendingImageQuestion === state.currentQuestion
    ) {
      state.pendingImageQuestion = null;
    }

    if (state.currentQuestion) {
      state.questions.push(state.currentQuestion);
    }

    state.currentQuestion = createQuestion(
      questionData.type,
      questionData.question,
      questionData.sourceNumber,
      state.nextQuestionOrdinal
    );
    state.nextQuestionOrdinal += 1;
    state.lastOptionTarget = null;
    return;
  }

  const optionData = parseOptionLine(line);

  if (optionData && state.currentQuestion) {
    const option = {
      id: `question-${state.currentQuestion.sourceIndex + 1}-option-${state.currentQuestion.options.length + 1}`,
      text: optionData.text,
      isCorrect: optionData.isCorrect,
      justification: "",
      sourceLetter: optionData.sourceLetter
    };

    state.currentQuestion.options.push(option);
    state.lastOptionTarget = {
      question: state.currentQuestion,
      option,
      optionIndex: state.currentQuestion.options.length - 1
    };
    return;
  }

  if (!optionData) {
    state.lastOptionTarget = null;

    if (hasQuestionContent(state.currentQuestion)) {
      if (
        state.pendingImageQuestion &&
        state.pendingImageQuestion === state.currentQuestion
      ) {
        state.pendingImageQuestion = null;
      }

      state.questions.push(state.currentQuestion);
      state.currentQuestion = null;
    }

    if (!state.currentQuestion) {
      state.currentQuestion = createQuestion(
        "single_choice",
        line.trim(),
        null,
        state.nextQuestionOrdinal
      );
      state.nextQuestionOrdinal += 1;
    } else {
      state.currentQuestion.question += ` ${line.trim()}`;
    }
  }
}

function processTextBlock(rawText, state) {
  const markerPattern = /(\[\[JUSTIFICACION(?:_ITEM_\d+_OPCION_\d+)?\]\]|\[\[FIN_JUSTIFICACION\]\])/gi;
  const parts = rawText
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ")
    .split(markerPattern);

  parts.forEach((part) => {
    if (!part.trim()) return;

    if (/^\[\[(?:JUSTIFICACION(?:_ITEM_\d+_OPCION_\d+)?|FIN_JUSTIFICACION)\]\]$/i.test(part.trim())) {
      processTextLine(part.trim(), state);
      return;
    }

    if (state.justificationBlock) {
      part.split("\n").forEach((line) => {
        if (line.trim()) processTextLine(line.trim(), state);
      });
      return;
    }

    getLines(part).forEach((line) => processTextLine(line, state));
  });
}

function parseHtmlToQuestions(html) {
  const $ = cheerio.load(html);

  const state = {
    questions: [],
    warnings: [],
    currentQuestion: null,
    pendingImageQuestion: null,
    lastOptionTarget: null,
    justificationBlock: null,
    nextQuestionOrdinal: 1
  };

  $("body")
    .children()
    .each((_, element) => {
      const currentElement = $(element);
      const text = currentElement
        .contents()
        .toArray()
        .map(getTextWithLineBreaks)
        .join("")
        .trim();
      const imageSources = currentElement
        .find("img")
        .map((_, img) => $(img).attr("src"))
        .get()
        .filter(Boolean);

      if (text) {
        processTextBlock(text, state);
      }

      imageSources.forEach((imageSrc) => processImage(imageSrc, state));
    });

  finishOpenBlockAsInvalid(state);

  if (state.currentQuestion) {
    state.questions.push(state.currentQuestion);
  }

  return {
    questions: state.questions,
    warnings: state.warnings
  };
}

function isValidQuestion(question) {
  if (!question.question) return false;

  if (question.type === "multi_dropdown") {
    return question.items.length > 0;
  }

  if (question.type === "drag_words") {
    return true;
  }

  return (
    question.options.length > 0 &&
    question.options.some((option) => option.isCorrect)
  );
}

function omitEmptyJustification(option) {
  const { sourceLetter, ...formattedOption } = option;
  if (option.justification?.trim()) {
    formattedOption.justification = option.justification.trim();
  } else {
    delete formattedOption.justification;
  }
  return formattedOption;
}

function formatMultiDropdownItem(item, options = item.options) {
  const answerOption = options.find((option) => option.isCorrect);

  return {
    id: item.id,
    text: item.text,
    options: options.map(omitEmptyJustification),
    answer: answerOption?.text || item.answer,
    answerOptionId: answerOption?.id || item.answerOptionId
  };
}

function formatQuestionsWithoutShuffle(questions) {
  return questions.map((question) => {
    if (question.type === "multi_dropdown") {
      return {
        type: question.type,
        question: question.question,
        hasImage: question.hasImage || Boolean(question.image),
        image: question.image || null,
        items: question.items.map((item) => formatMultiDropdownItem(item))
      };
    }

    if (question.type === "drag_words") {
      const cleanOptions = question.options.map(({ justification, ...option }) => option);
      return {
        ...question,
        options: cleanOptions,
        sourceNumber: undefined,
        sourceIndex: undefined,
        hasImage: question.hasImage || Boolean(question.image),
        image: question.image || null
      };
    }

    const options = [];
    const answers = [];

    question.options.forEach((option, index) => {
      const letter = OPTION_LETTERS[index];

      options.push({
        ...omitEmptyJustification(option),
        letter
      });

      if (option.isCorrect) answers.push(letter);
    });

    return {
      type: question.type,
      question: question.question,
      hasImage: question.hasImage || Boolean(question.image),
      image: question.image || null,
      options,
      answers
    };
  });
}

function randomizeQuestionOptions(question) {
  if (question.type === "multi_dropdown") {
    return {
      type: question.type,
      question: question.question,
      hasImage: question.hasImage || Boolean(question.image),
      image: question.image || null,
      items: question.items.map((item) => {
        const shuffledOptions = shuffleArray(item.options);
        return formatMultiDropdownItem(item, shuffledOptions);
      })
    };
  }

  if (question.type === "drag_words") {
    const cleanOptions = question.options.map(({ justification, ...option }) => option);
    return {
      ...question,
      options: cleanOptions,
      sourceNumber: undefined,
      sourceIndex: undefined,
      hasImage: question.hasImage || Boolean(question.image),
      image: question.image || null
    };
  }

  const shuffledOptions = shuffleArray(question.options);
  const options = [];
  const answers = [];

  shuffledOptions.forEach((option, index) => {
    const letter = OPTION_LETTERS[index];
    options.push({
      ...omitEmptyJustification(option),
      letter
    });

    if (option.isCorrect) answers.push(letter);
  });

  return {
    type: question.type,
    question: question.question,
    hasImage: question.hasImage || Boolean(question.image),
    image: question.image || null,
    options,
    answers
  };
}

function getFinalWarnings(warnings, validQuestions) {
  const validIndexBySourceIndex = new Map(
    validQuestions.map((question, index) => [question.sourceIndex, index])
  );

  return warnings
    .filter((warning) => validIndexBySourceIndex.has(warning.sourceIndex))
    .map((warning) => {
      const { sourceIndex, ...publicWarning } = warning;
      return {
        ...publicWarning,
        questionIndex: validIndexBySourceIndex.get(sourceIndex)
      };
    });
}

async function convertWordToJson(fileBuffer, options = {}) {
  const { shuffle = true } = options;
  const html = await convertWordToHtml(fileBuffer);
  const parsed = parseHtmlToQuestions(html);
  const validQuestions = parsed.questions.filter(isValidQuestion);
  const questions = shuffle
    ? shuffleArray(validQuestions).map(randomizeQuestionOptions)
    : formatQuestionsWithoutShuffle(validQuestions);
  const warnings = getFinalWarnings(parsed.warnings, validQuestions);
  const justificationCount = validQuestions.reduce((count, question) => {
    if (question.type === "drag_words") return count;

    if (question.type === "multi_dropdown") {
      return (
        count +
        question.items.reduce(
          (itemCount, item) =>
            itemCount +
            item.options.filter((option) => option.justification.trim()).length,
          0
        )
      );
    }

    return (
      count +
      question.options.filter((option) => option.justification.trim()).length
    );
  }, 0);

  return {
    total: questions.length,
    justificationCount,
    warnings,
    questions
  };
}

module.exports = {
  convertWordToJson,
  parseHtmlToQuestions,
  formatQuestionsWithoutShuffle,
  randomizeQuestionOptions
};
