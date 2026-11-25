export function assignReviewQuestionIds(questions) {
  const usedIds = new Set();

  return questions.map((question, index) => {
    const sourceId =
      question.reviewId ??
      question.id ??
      question.contentId ??
      (question.sourceIndex !== undefined && question.sourceIndex !== null
        ? `source:${question.sourceIndex}`
        : null);
    const baseId = sourceId === null ? `session:${index}` : String(sourceId);
    let reviewId = baseId;
    let duplicateIndex = 1;

    while (usedIds.has(reviewId)) {
      reviewId = `${baseId}:duplicate:${index}:${duplicateIndex}`;
      duplicateIndex += 1;
    }

    usedIds.add(reviewId);
    return { ...question, reviewId };
  });
}

export function createErrorReviewProgress({ enabled = true, scoreableCount = 0 } = {}) {
  return {
    phase: "normal",
    enabled: Boolean(enabled),
    scoreableCount: Math.max(0, Number(scoreableCount) || 0),
    originalCorrectCount: 0,
    originalAnsweredIds: [],
    originalIncorrectIds: [],
    originalResult: null,
    reviewQueue: [],
    correctedIds: [],
    activeReviewId: null,
    activeAnswerRecorded: false,
    reviewAttempts: 0
  };
}

export function recordOriginalAnswer(progress, { questionId, isCorrect, isScored = true }) {
  if (
    progress.phase !== "normal" ||
    !isScored ||
    questionId === undefined ||
    questionId === null ||
    progress.originalAnsweredIds.includes(questionId)
  ) {
    return progress;
  }

  return {
    ...progress,
    originalAnsweredIds: [...progress.originalAnsweredIds, questionId],
    originalCorrectCount: progress.originalCorrectCount + (isCorrect ? 1 : 0),
    originalIncorrectIds: isCorrect || progress.originalIncorrectIds.includes(questionId)
      ? progress.originalIncorrectIds
      : [...progress.originalIncorrectIds, questionId]
  };
}

function percentage(correctCount, totalCount) {
  return totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
}

export function finishOriginalRound(progress) {
  if (progress.phase !== "normal") return progress;

  const incorrectCount = progress.originalIncorrectIds.length;
  const originalResult = {
    correctCount: progress.originalCorrectCount,
    incorrectCount,
    scoreableCount: progress.scoreableCount,
    percentage: percentage(progress.originalCorrectCount, progress.scoreableCount)
  };
  const reviewQueue = progress.enabled ? [...progress.originalIncorrectIds] : [];

  return {
    ...progress,
    phase: reviewQueue.length > 0 ? "review" : "complete",
    originalResult,
    reviewQueue,
    correctedIds: [],
    activeReviewId: reviewQueue[0] ?? null,
    activeAnswerRecorded: false,
    reviewAttempts: 0
  };
}

export function recordReviewAnswer(progress, { questionId, isCorrect }) {
  if (
    progress.phase !== "review" ||
    !progress.activeReviewId ||
    progress.activeAnswerRecorded ||
    questionId !== progress.activeReviewId ||
    !progress.reviewQueue.includes(questionId)
  ) {
    return progress;
  }

  const remainingQueue = progress.reviewQueue.filter((id) => id !== questionId);
  const reviewQueue = isCorrect
    ? remainingQueue
    : [...remainingQueue, questionId];
  const correctedIds = isCorrect && !progress.correctedIds.includes(questionId)
    ? [...progress.correctedIds, questionId]
    : progress.correctedIds;

  return {
    ...progress,
    reviewQueue,
    correctedIds,
    activeAnswerRecorded: true,
    reviewAttempts: progress.reviewAttempts + 1
  };
}

export function advanceErrorReview(progress) {
  if (progress.phase !== "review" || !progress.activeAnswerRecorded) {
    return progress;
  }

  if (progress.reviewQueue.length === 0) {
    return {
      ...progress,
      phase: "complete",
      activeReviewId: null,
      activeAnswerRecorded: false
    };
  }

  return {
    ...progress,
    activeReviewId: progress.reviewQueue[0],
    activeAnswerRecorded: false
  };
}

export function finishErrorReview(progress) {
  if (progress.phase !== "review") return progress;

  return {
    ...progress,
    phase: "complete",
    activeReviewId: null,
    activeAnswerRecorded: false
  };
}

export function getErrorReviewSummary(progress) {
  const originalResult = progress.originalResult || {
    correctCount: progress.originalCorrectCount,
    incorrectCount: progress.originalIncorrectIds.length,
    scoreableCount: progress.scoreableCount,
    percentage: percentage(progress.originalCorrectCount, progress.scoreableCount)
  };
  const errorsCorrected = progress.correctedIds.length;
  const errorsPending = progress.reviewQueue.length;
  const afterReviewCorrectCount = originalResult.correctCount + errorsCorrected;

  return {
    originalResult,
    afterReviewCorrectCount,
    afterReviewPercentage: percentage(afterReviewCorrectCount, originalResult.scoreableCount),
    errorsCorrected,
    errorsTotal: originalResult.incorrectCount,
    errorsPending
  };
}
