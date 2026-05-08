const mammoth = require("mammoth");
const cheerio = require("cheerio");

const OPTION_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const QUESTION_TYPES = {
  "@": "true_false",
  "@@": "single_choice",
  "@@@": "multiple_choice",
  "@@@@": "multi_dropdown",
  "@@@@@": "drag_words"
};

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function normalizeWordText(rawText) {
  return rawText
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/(@{1,5}\s*\d+[\).]\s*)/g, "\n$1")
    .replace(/([a-zA-Z]\)\s*)/g, "\n$1")
    .replace(/(\d+\)\s*)/g, "\n$1");
}

function getLines(rawText) {
  return normalizeWordText(rawText)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function getQuestionTypeFromMarker(marker) {
  return QUESTION_TYPES[marker] || "single_choice";
}

function parseQuestionLine(line) {
  const typedQuestionMatch = line.match(/^(@{1,5})\s*(\d+)[\).]\s*(.+)$/);

  if (typedQuestionMatch) {
    return {
      type: getQuestionTypeFromMarker(typedQuestionMatch[1]),
      question: typedQuestionMatch[3].trim()
    };
  }

  const numberedQuestionMatch = line.match(/^(\d+)[\).]\s*(.+)$/);

  if (numberedQuestionMatch) {
    return {
      type: "single_choice",
      question: numberedQuestionMatch[2].trim()
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
    isCorrect
  };
}

function parseMultiDropdownLine(line) {
  const match = line.match(/^(\d+)\)\s*(.+?)\s*\[(.+)\]$/);

  if (!match) return null;

  const id = Number(match[1]);
  const text = match[2].trim();
  const rawOptions = match[3].split("/").map((option) => option.trim());

  const options = [];
  let answer = null;

  rawOptions.forEach((option) => {
    const isCorrect = option.endsWith("*");
    const cleanOption = isCorrect ? option.slice(0, -1).trim() : option;

    options.push(cleanOption);

    if (isCorrect) {
      answer = cleanOption;
    }
  });

  if (!answer) return null;

  return {
    id,
    text,
    options,
    answer
  };
}

function createQuestion(type, question) {
  return {
    type,
    question,
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

function processTextLine(line, state) {
  const { questions } = state;

  if (isImageMarker(line)) {
    if (state.currentQuestion) {
      state.currentQuestion.hasImage = true;
      state.pendingImageQuestion = state.currentQuestion;
    }

    return;
  }

  if (state.currentQuestion?.type === "multi_dropdown") {
    const item = parseMultiDropdownLine(line);

    if (item) {
      state.currentQuestion.items.push(item);
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
      questions.push(state.currentQuestion);
    }

    state.currentQuestion = createQuestion(
      questionData.type,
      questionData.question
    );

    return;
  }

  const optionData = parseOptionLine(line);

  if (optionData && state.currentQuestion) {
    state.currentQuestion.options.push({
      text: optionData.text,
      isCorrect: optionData.isCorrect
    });

    return;
  }

  if (!optionData) {
    if (state.currentQuestion && state.currentQuestion.options.length > 0) {
      if (
        state.pendingImageQuestion &&
        state.pendingImageQuestion === state.currentQuestion
      ) {
        state.pendingImageQuestion = null;
      }

      questions.push(state.currentQuestion);
      state.currentQuestion = null;
    }

    if (!state.currentQuestion) {
      state.currentQuestion = createQuestion("single_choice", line.trim());
    } else {
      state.currentQuestion.question += " " + line.trim();
    }
  }
}

function parseHtmlToQuestions(html) {
  const $ = cheerio.load(html);

  const state = {
    questions: [],
    currentQuestion: null,
    pendingImageQuestion: null
  };

  $("body")
    .children()
    .each((_, element) => {
      const currentElement = $(element);

      const text = currentElement.text().trim();
      const imageSources = currentElement
        .find("img")
        .map((_, img) => $(img).attr("src"))
        .get()
        .filter(Boolean);

      if (text) {
        const lines = getLines(text);

        lines.forEach((line) => {
          processTextLine(line, state);
        });
      }

      imageSources.forEach((imageSrc) => {
        processImage(imageSrc, state);
      });
    });

  if (state.currentQuestion) {
    state.questions.push(state.currentQuestion);
  }

  console.log("PREGUNTAS PARSEADAS:");
  state.questions.forEach((question, index) => {
    console.log(index + 1, {
      question: question.question,
      type: question.type,
      hasImage: question.hasImage,
      image: Boolean(question.image),
      options: question.options.length,
      items: question.items.length
    });
  });

  return state.questions;
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

function formatQuestionsWithoutShuffle(questions) {
  return questions.map((question) => {
    if (question.type === "multi_dropdown") {
      return {
        type: question.type,
        question: question.question,
        hasImage: question.hasImage || Boolean(question.image),
        image: question.image || null,
        items: question.items
      };
    }

    if (question.type === "drag_words") {
      return {
        ...question,
        hasImage: question.hasImage || Boolean(question.image),
        image: question.image || null
      };
    }

    const options = [];
    const answers = [];

    question.options.forEach((option, index) => {
      const letter = OPTION_LETTERS[index];

      options.push({
        letter,
        text: option.text
      });

      if (option.isCorrect) {
        answers.push(letter);
      }
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
      items: question.items.map((item) => ({
        ...item,
        options: shuffleArray(item.options)
      }))
    };
  }

  if (question.type === "drag_words") {
    return {
      ...question,
      hasImage: question.hasImage || Boolean(question.image),
      image: question.image || null
    };
  }

  const shuffledOptions = shuffleArray(question.options);

  const newOptions = [];
  const newAnswers = [];

  shuffledOptions.forEach((option, index) => {
    const newLetter = OPTION_LETTERS[index];

    newOptions.push({
      letter: newLetter,
      text: option.text
    });

    if (option.isCorrect) {
      newAnswers.push(newLetter);
    }
  });

  return {
    type: question.type,
    question: question.question,
    hasImage: question.hasImage || Boolean(question.image),
    image: question.image || null,
    options: newOptions,
    answers: newAnswers
  };
}

function randomizeQuestionsAndOptions(questions) {
  return shuffleArray(questions).map(randomizeQuestionOptions);
}

async function convertWordToJson(fileBuffer, options = {}) {
  const { shuffle = true } = options;

  const html = await convertWordToHtml(fileBuffer);

  const questions = parseHtmlToQuestions(html);

  const validQuestions = questions.filter(isValidQuestion);

  if (!shuffle) {
    return formatQuestionsWithoutShuffle(validQuestions);
  }

  return randomizeQuestionsAndOptions(validQuestions);
}

module.exports = {
  convertWordToJson
};