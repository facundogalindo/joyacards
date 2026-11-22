"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "..");
const REPO = path.resolve(ROOT, "..", "..");
const BACKEND = path.join(REPO, "backend");
const mammoth = require(path.join(BACKEND, "node_modules", "mammoth"));
const cheerio = require(path.join(BACKEND, "node_modules", "cheerio"));
const { convertWordToJson, parseHtmlToQuestions } = require(path.join(BACKEND, "src", "services", "wordToJson.service.js"));

function compareDocumentBody($, expected) {
  const elements = $("body").children().toArray();
  const blocks = elements.map((element) => ({
    text: $(element).text().trim(),
    images: $(element).find("img").length
  }));
  const issues = [];
  let cursor = 0;
  let embeddedImageRefs = 0;
  const seenImages = new Map();

  for (const question of expected) {
    const marker = question.responseType === "multiple" ? "@@@" : "@@";
    const heading = new RegExp(`^${marker}\\s+${question.extractionPosition}\\.\\s*`);
    while (cursor < blocks.length && !heading.test(blocks[cursor].text)) cursor += 1;
    if (cursor >= blocks.length) {
      issues.push({ position: question.extractionPosition, issue: "question_heading_missing" });
      continue;
    }
    const actualPrompt = blocks[cursor].text.replace(heading, "");
    if (actualPrompt !== question.prompt) {
      issues.push({ position: question.extractionPosition, issue: "prompt_mismatch", actualPrompt });
    }
    cursor += 1;
    const actualOptions = [];
    let actualImageCount = 0;
    while (cursor < blocks.length && !/^@{2,3}\s+\d+\.\s*/.test(blocks[cursor].text)) {
      const option = blocks[cursor].text.match(/^([a-z])\)\s*(.*)$/i);
      if (option) actualOptions.push(option[2]);
      actualImageCount += blocks[cursor].images;
      cursor += 1;
    }
    const expectedOptions = question.options.map((option) => option.text);
    if (JSON.stringify(actualOptions) !== JSON.stringify(expectedOptions)) {
      issues.push({
        position: question.extractionPosition,
        issue: "options_mismatch",
        expectedCount: expectedOptions.length,
        actualCount: actualOptions.length
      });
    }
    const expectedImageCount = question.images.length;
    if (actualImageCount !== expectedImageCount) {
      issues.push({
        position: question.extractionPosition,
        issue: "image_count_mismatch",
        expectedImageCount,
        actualImageCount
      });
    }
    embeddedImageRefs += actualImageCount;
    if (actualImageCount) seenImages.set(question.extractionPosition, actualImageCount);
  }
  return { issues, embeddedImageRefs, questionImagePositions: [...seenImages.keys()] };
}

(async () => {
  const source = JSON.parse(await fs.readFile(path.join(ROOT, "preguntas-sin-resolver.json"), "utf8"));
  const buffer = await fs.readFile(path.join(ROOT, "Redes_Parcial_4K1_2026_SIN_RESOLVER.docx"));
  const htmlResult = await mammoth.convertToHtml({ buffer });
  const $ = cheerio.load(htmlResult.value);
  const bodyCheck = compareDocumentBody($, source.questions);
  const parsed = parseHtmlToQuestions(htmlResult.value);
  const imported = await convertWordToJson(buffer, { shuffle: false });
  const multipleSource = source.questions.filter((question) => question.responseType === "multiple");
  const importedPrompts = imported.questions.map((question) => question.question);
  const unmatchedMultiple = [];
  let scanFrom = 0;
  for (const question of multipleSource) {
    const matchIndex = importedPrompts.findIndex((prompt, index) => index >= scanFrom && prompt === question.prompt);
    if (matchIndex === -1) unmatchedMultiple.push(question.extractionPosition);
    else scanFrom = matchIndex + 1;
  }
  const noKeyCount = imported.questions.filter((question) =>
    question.isUnscored === true && question.answers.length === 0 && question.options.every((option) => !option.isCorrect)
  ).length;
  const summary = {
    docxBody: {
      questionCount: source.questions.length,
      promptOptionImageIssues: bodyCheck.issues,
      embeddedImageReferences: bodyCheck.embeddedImageRefs,
      questionsWithImages: bodyCheck.questionImagePositions.length,
      mammothMessages: htmlResult.messages.map((message) => ({ type: message.type, message: message.message }))
    },
    importer: {
      parsedQuestionRecords: parsed.questions.length,
      importedQuestionCount: imported.total,
      sourceQuestionsWithUnscoredMultiType: multipleSource.length,
      importedUnscoredWithoutAnswers: noKeyCount,
      multipleQuestionsNotPreservedByCurrentImporter: unmatchedMultiple,
      importedImages: imported.questions.filter((question) => question.hasImage).length,
      justificationCount: imported.justificationCount,
      warnings: imported.warnings
    }
  };
  console.log(JSON.stringify(summary, null, 2));
  if (bodyCheck.issues.length || bodyCheck.embeddedImageRefs !== 40 || noKeyCount !== imported.total) {
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
