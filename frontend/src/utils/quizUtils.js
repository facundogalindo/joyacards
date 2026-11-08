export function shuffleArray(array) {
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

export function areAnswersCorrect(selectedAnswers, correctAnswers) {
  if (selectedAnswers.length !== correctAnswers.length) return false;
  return selectedAnswers.every((answer) => correctAnswers.includes(answer));
}

function getCorrectDropdownOption(item) {
  if (item.answerOptionId) {
    return item.options.find((option) => option.id === item.answerOptionId);
  }
  return item.options.find((option) =>
    (typeof option === "string" ? option : option.text) === item.answer
  );
}

export function areMultiDropdownAnswersCorrect(items, userAnswers) {
  return items.every((item) => {
    const correctOption = getCorrectDropdownOption(item);
    const correctValue =
      correctOption?.id ||
      (typeof correctOption === "string" ? `${item.id}-option-${item.options.indexOf(correctOption) + 1}` : null) ||
      item.answer;
    return userAnswers[item.id] === correctValue;
  });
}

export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function shuffleNormalQuestionOptions(question) {
  if (!question.options || !question.answers) return question;

  const shuffledOptions = shuffleArray(question.options);
  const options = shuffledOptions.map((option, index) => ({
    ...option,
    letter: String.fromCharCode(65 + index),
    isCorrect:
      typeof option.isCorrect === "boolean"
        ? option.isCorrect
        : question.answers.includes(option.letter)
  }));

  return {
    ...question,
    options,
    answers: options
      .filter((option) => option.isCorrect)
      .map((option) => option.letter)
  };
}

function shuffleMultiDropdownOptions(question) {
  if (!question.items) return question;

  return {
    ...question,
    items: question.items.map((item) => ({
      ...item,
      options: shuffleArray(item.options)
    }))
  };
}

export function prepareQuizQuestions(questions, amount) {
  return shuffleArray(questions)
    .slice(0, amount)
    .map((question) => {
      if (question.type === "multi_dropdown") {
        return shuffleMultiDropdownOptions(question);
      }

      if (
        question.type === "single_choice" ||
        question.type === "multiple_choice" ||
        question.type === "true_false"
      ) {
        return shuffleNormalQuestionOptions(question);
      }

      return question;
    });
}
