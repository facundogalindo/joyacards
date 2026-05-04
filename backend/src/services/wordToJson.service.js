const mammoth = require("mammoth");

const OPTION_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function normalizeWordText(rawText) {
  return rawText
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/(\d+[\).]\s*)/g, "\n$1")
    .replace(/([a-zA-Z][\).]\s*)/g, "\n$1");
}

function getLines(rawText) {
  return normalizeWordText(rawText)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseOptionLine(line) {
  const optionMatch = line.match(/^([a-zA-Z])[\).]\s*(.+)$/);

  if (!optionMatch) return null;

  const originalLetter = optionMatch[1].toUpperCase();
  let text = optionMatch[2].trim();

  const isCorrect = text.endsWith("*");

  if (isCorrect) {
    text = text.slice(0, -1).trim();
  }

  return {
    originalLetter,
    text,
    isCorrect
  };
}

function randomizeQuestionOptions(question) {
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
    question: question.question,
    options: newOptions,
    answers: newAnswers
  };
}

function randomizeQuestionsAndOptions(questions) {
  return shuffleArray(questions).map(randomizeQuestionOptions);
}

async function convertWordToJson(fileBuffer) {
  const result = await mammoth.extractRawText({
    buffer: fileBuffer
  });

  const lines = getLines(result.value);

  console.log("RAW TEXT:");
  console.log(result.value);

  console.log("LÍNEAS NORMALIZADAS:");
  lines.forEach((line, index) => {
    console.log(index + 1, "=>", JSON.stringify(line));
  });

  const questions = [];
  let currentQuestion = null;

  for (const line of lines) {
    const numberedQuestionMatch = line.match(/^(\d+)[\).]\s*(.+)$/);

    if (numberedQuestionMatch) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }

      currentQuestion = {
        question: numberedQuestionMatch[2].trim(),
        options: []
      };

      continue;
    }

    const optionData = parseOptionLine(line);

    if (optionData && currentQuestion) {
      currentQuestion.options.push({
        text: optionData.text,
        isCorrect: optionData.isCorrect
      });

      continue;
    }

    // Soporte por si Word no lee la numeración automática como texto
    if (!optionData) {
      if (currentQuestion && currentQuestion.options.length > 0) {
        questions.push(currentQuestion);
        currentQuestion = null;
      }

      if (!currentQuestion) {
        currentQuestion = {
          question: line.trim(),
          options: []
        };
      } else {
        currentQuestion.question += " " + line.trim();
      }
    }
  }

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  const validQuestions = questions.filter((question) => {
    return (
      question.question &&
      question.options.length > 0 &&
      question.options.some((option) => option.isCorrect)
    );
  });

  return randomizeQuestionsAndOptions(validQuestions);
}

module.exports = {
  convertWordToJson
};