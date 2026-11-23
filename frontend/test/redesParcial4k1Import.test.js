import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { summarizeQuiz } from "../src/utils/quizUtils.js";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(testDirectory, "../..");
const contentDirectory = path.join(repositoryRoot, "content", "redes-parcial-4k1-2026");
const questionnairePath = path.join(contentDirectory, "preguntas-resueltas.json");
const documentPath = path.join(contentDirectory, "Redes_Parcial_4K1_2026_RESUELTO.docx");
const require = createRequire(import.meta.url);
const mammoth = require("../../backend/node_modules/mammoth");
const {
  convertWordToJson,
  parseHtmlToQuestions
} = require("../../backend/src/services/wordToJson.service.js");

function imageDigest(dataUrl) {
  if (!dataUrl) return null;
  return createHash("sha256")
    .update(Buffer.from(dataUrl.split(",")[1], "base64"))
    .digest("hex");
}

test("the resolved 4K1 DOCX imports all 132 questions without losing content or keys", async () => {
  const source = JSON.parse(await readFile(questionnairePath, "utf8"));
  const buffer = await readFile(documentPath);
  const html = await mammoth.convertToHtml({ buffer });
  const parsed = parseHtmlToQuestions(html.value);
  const result = await convertWordToJson(buffer, { shuffle: false });

  assert.deepEqual(html.messages, []);
  assert.equal((html.value.match(/Justificación:/g) || []).length, 585);
  assert.equal((html.value.match(/Evaluación de esta alternativa/g) || []).length, 585);
  assert.equal(html.value.includes("Evaluaci?n"), false);
  assert.equal(html.value.includes("\\u00f3"), false);
  assert.equal(parsed.questions.length, 132);
  assert.deepEqual(parsed.warnings, []);
  assert.equal(result.total, 132);
  assert.deepEqual(result.warnings, []);

  const ids = source.questions.map((question) => question.id);
  assert.equal(new Set(ids).size, 132);
  const sourceIdByPosition = new Map(
    source.questions.map((question) => [question.extractionPosition, question.id])
  );
  assert.equal(sourceIdByPosition.size, 132);

  const sourceNumbers = parsed.questions.map((question) => question.sourceNumber);
  assert.deepEqual(sourceNumbers, Array.from({ length: 132 }, (_, index) => index + 1));
  assert.deepEqual(
    parsed.questions.map((question) => question.sourceIndex),
    Array.from({ length: 132 }, (_, index) => index)
  );

  let expectedOptions = 0;
  let expectedImageReferences = 0;
  let parsedJustifications = 0;
  let verifiedCount = 0;
  let unscoredCount = 0;
  let multipleCount = 0;
  const imageHashes = new Set();

  for (let index = 0; index < source.questions.length; index += 1) {
    const original = source.questions[index];
    const audit = original.resolution;
    const parsedQuestion = parsed.questions[index];
    const importedQuestion = result.questions[index];
    const context = `question ${index + 1} (${original.id})`;
    const expectedType = original.responseType === "multiple"
      ? "multiple_choice"
      : "single_choice";

    assert.equal(sourceIdByPosition.get(parsedQuestion.sourceNumber), original.id, `${context}: source ID mapping`);
    assert.equal(parsedQuestion.sourceNumber, original.extractionPosition, context);
    assert.equal(parsedQuestion.question, original.prompt, `${context}: parsed prompt`);
    assert.equal(importedQuestion.question, original.prompt, `${context}: imported prompt`);
    assert.equal(parsedQuestion.type, expectedType, `${context}: parsed type`);
    assert.equal(importedQuestion.type, expectedType, `${context}: imported type`);
    assert.equal(parsedQuestion.options.length, original.options.length, `${context}: parsed option count`);
    assert.deepEqual(
      parsedQuestion.options.map((option) => option.text),
      original.options.map((option) => option.text),
      `${context}: parsed option text/order`
    );
    assert.deepEqual(
      importedQuestion.options.map((option) => option.text),
      original.options.map((option) => option.text),
      `${context}: imported option text/order`
    );

    const verified = audit.status === "VERIFICADA";
    const expectedAnswerIndexes = verified
      ? original.options
          .map((option, optionIndex) => audit.selectedOptionIds.includes(option.id) ? optionIndex : -1)
          .filter((optionIndex) => optionIndex >= 0)
      : [];
    const expectedLetters = expectedAnswerIndexes.map((optionIndex) =>
      String.fromCharCode(65 + optionIndex)
    );

    assert.equal(parsedQuestion.isUnscored === true, !verified, `${context}: parsed scoring status`);
    assert.equal(importedQuestion.isUnscored === true, !verified, `${context}: imported scoring status`);
    assert.deepEqual(importedQuestion.answers, expectedLetters, `${context}: answer key`);
    assert.deepEqual(
      parsedQuestion.options.map((option) => option.isCorrect),
      original.options.map((_, optionIndex) => expectedAnswerIndexes.includes(optionIndex)),
      `${context}: parsed correctness flags`
    );
    assert.deepEqual(
      importedQuestion.options.map((option) => option.isCorrect),
      original.options.map((_, optionIndex) => expectedAnswerIndexes.includes(optionIndex)),
      `${context}: imported correctness flags`
    );

    if (verified) {
      verifiedCount += 1;
      assert.ok(expectedLetters.length > 0, `${context}: verified question has no key`);
    } else {
      unscoredCount += 1;
      assert.deepEqual(importedQuestion.answers, [], `${context}: unscored question has no key`);
      assert.ok(importedQuestion.options.every((option) => !option.isCorrect), `${context}: unscored options stay neutral`);
    }

    if (original.responseType === "multiple") multipleCount += 1;
    expectedOptions += original.options.length;

    assert.equal(parsedQuestion.options.length, original.resolution.optionEvaluations.length, `${context}: evaluation count`);
    for (let optionIndex = 0; optionIndex < original.options.length; optionIndex += 1) {
      const parsedReason = parsedQuestion.options[optionIndex].justification;
      const importedReason = importedQuestion.options[optionIndex].justification;
      const expectedReason = original.resolution.optionEvaluations[optionIndex].rationale;
      assert.ok(parsedReason.includes(expectedReason), `${context}: parsed rationale ${optionIndex + 1}`);
      assert.ok(importedReason?.includes(expectedReason), `${context}: imported rationale ${optionIndex + 1}`);
      parsedJustifications += Number(Boolean(parsedReason.trim()));
    }

    assert.equal(original.images.length <= 1, true, `${context}: importer supports one image per question`);
    const expectedImage = original.images[0];
    if (expectedImage) {
      expectedImageReferences += 1;
      const expectedBytes = await readFile(path.join(contentDirectory, expectedImage.file));
      const expectedDigest = createHash("sha256").update(expectedBytes).digest("hex");
      assert.equal(expectedDigest, expectedImage.sha256, `${context}: source asset hash`);
      assert.equal(imageDigest(importedQuestion.image), expectedImage.sha256, `${context}: imported image bytes`);
      assert.equal(importedQuestion.hasImage, true, `${context}: image flag`);
      imageHashes.add(expectedImage.sha256);
    } else {
      assert.equal(importedQuestion.image, null, `${context}: unexpected image`);
      assert.equal(importedQuestion.hasImage, false, `${context}: unexpected image flag`);
    }
  }

  assert.equal(expectedOptions, 585);
  assert.equal(verifiedCount, 92);
  assert.equal(unscoredCount, 40);
  assert.equal(multipleCount, 15);
  assert.equal(expectedImageReferences, 40);
  assert.equal(imageHashes.size, 15);
  assert.equal(parsedJustifications, 585);
  assert.equal(result.justificationCount, 585);
  assert.equal(result.questions.filter((question) => question.hasImage).length, 40);
  assert.deepEqual(summarizeQuiz(result.questions, 0), {
    presentedCount: 132,
    scoreableCount: 92,
    unscoredCount: 40,
    correctCount: 0
  });

  assert.equal(parsed.questions[2].question, source.questions[2].prompt);
  assert.equal(parsed.questions[23].question, source.questions[23].prompt);
  assert.match(parsed.questions[2].question, /RFC 1918\)/);
  assert.match(parsed.questions[23].question, /TCP 22\)/);
});
