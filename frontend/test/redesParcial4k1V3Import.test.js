import test from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { summarizeQuiz } from "../src/utils/quizUtils.js";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(testDirectory, "../..");
const contentDirectory = path.join(repositoryRoot, "content", "redes-parcial-4k1-2026");
const require = createRequire(import.meta.url);
const mammoth = require("../../backend/node_modules/mammoth");
const {
  convertWordToJson,
  parseHtmlToQuestions
} = require("../../backend/src/services/wordToJson.service.js");

const ojoSuffix = "(OJO: PREGUNTA AMBIGUA)";
const ojoPositions = [37, 60, 79, 83, 119, 127];

function imageDigest(dataUrl) {
  if (!dataUrl) return null;
  return createHash("sha256")
    .update(Buffer.from(dataUrl.split(",")[1], "base64"))
    .digest("hex");
}

test("the 4K1 V3 DOCX preserves all questions, explanations, images, warnings, and verified keys", async () => {
  const extraction = JSON.parse(await readFile(path.join(contentDirectory, "preguntas-sin-resolver.json"), "utf8"));
  const resolvedV2 = JSON.parse(await readFile(path.join(contentDirectory, "preguntas-resueltas-v2.json"), "utf8"));
  const resolved = JSON.parse(await readFile(path.join(contentDirectory, "preguntas-resueltas-v3.json"), "utf8"));
  const v2Envelope = structuredClone(resolvedV2);
  const v3Envelope = structuredClone(resolved);
  assert.equal(resolved.auditMetadata.functionalValidation, "local_api_import_smoke_passed");
  v3Envelope.questions = v2Envelope.questions;
  v3Envelope.auditMetadata = v2Envelope.auditMetadata;
  assert.deepEqual(v3Envelope, v2Envelope, "V3 changes only questions and iteration audit metadata at the document root");
  const documentPath = path.join(contentDirectory, "Redes_Parcial_4K1_2026_RESUELTO_V3.docx");
  const buffer = await readFile(documentPath);
  const html = await mammoth.convertToHtml({ buffer });
  const parsed = parseHtmlToQuestions(html.value);
  const imported = await convertWordToJson(buffer, { shuffle: false });

  assert.deepEqual(html.messages, []);
  assert.deepEqual(parsed.warnings, []);
  assert.deepEqual(imported.warnings, []);
  assert.equal(extraction.questions.length, 132);
  assert.equal(resolvedV2.questions.length, 132);
  assert.equal(resolved.questions.length, 132);
  assert.equal(parsed.questions.length, 132);
  assert.equal(imported.total, 132);
  assert.equal(imported.justificationCount, 585);
  assert.equal((html.value.match(/\[\[JUSTIFICACION\]\]/g) || []).length, 585);

  let optionsCount = 0;
  let imageReferences = 0;
  let verifiedCount = 0;
  let unscoredCount = 0;
  let multipleCount = 0;
  let rationaleCount = 0;
  const uniqueImages = new Set();
  const actualWarningPositions = [];
  const changedRationales = [];

  for (let index = 0; index < extraction.questions.length; index += 1) {
    const original = extraction.questions[index];
    const previous = resolvedV2.questions[index];
    const audit = resolved.questions[index];
    const parsedQuestion = parsed.questions[index];
    const importedQuestion = imported.questions[index];
    const context = `question ${index + 1} (${original.id})`;
    const expectedType = original.responseType === "multiple" ? "multiple_choice" : "single_choice";
    const shouldWarn = ojoPositions.includes(original.extractionPosition);
    const visiblePrompt = shouldWarn ? `${original.prompt} ${ojoSuffix}` : original.prompt;
    const verified = audit.resolution.status === "VERIFICADA";

    assert.equal(audit.id, original.id, `${context}: stable ID`);
    assert.equal(audit.id, previous.id, `${context}: ID unchanged from V2`);
    assert.equal(audit.prompt, original.prompt, `${context}: academic prompt remains unchanged in V3 JSON`);
    assert.equal(audit.prompt, previous.prompt, `${context}: prompt unchanged from V2`);
    assert.equal(audit.responseType, previous.responseType, `${context}: response type unchanged from V2`);
    assert.deepEqual(audit.options, previous.options, `${context}: original option records unchanged from V2`);
    assert.deepEqual(audit.images, previous.images, `${context}: image references unchanged from V2`);
    assert.equal(audit.resolution.status, previous.resolution.status, `${context}: verification status unchanged from V2`);
    assert.deepEqual(audit.resolution.selectedOptionIds, previous.resolution.selectedOptionIds, `${context}: answer key unchanged from V2`);
    assert.equal(audit.resolution.confidence, previous.resolution.confidence, `${context}: confidence unchanged from V2`);
    assert.deepEqual(audit.resolution.sources, previous.resolution.sources, `${context}: sources unchanged from V2`);
    assert.equal(parsedQuestion.sourceNumber, original.extractionPosition, `${context}: source position`);
    assert.equal(parsedQuestion.question, visiblePrompt, `${context}: visible prompt and warning`);
    assert.equal(importedQuestion.question, visiblePrompt, `${context}: imported prompt and warning`);
    assert.equal(parsedQuestion.type, expectedType, `${context}: parsed response type`);
    assert.equal(importedQuestion.type, expectedType, `${context}: imported response type`);
    assert.equal(parsedQuestion.isUnscored === true, !verified, `${context}: parsed scoring status`);
    assert.equal(importedQuestion.isUnscored === true, !verified, `${context}: imported scoring status`);
    assert.equal(parsedQuestion.options.length, original.options.length, `${context}: parsed option count`);
    assert.equal(importedQuestion.options.length, original.options.length, `${context}: imported option count`);
    assert.deepEqual(parsedQuestion.options.map((option) => option.text), original.options.map((option) => option.text), `${context}: option wording/order`);
    assert.deepEqual(importedQuestion.options.map((option) => option.text), original.options.map((option) => option.text), `${context}: imported option wording/order`);

    const sourceKey = audit.resolution.selectedOptionIds;
    const expectedIndexes = verified
      ? original.options.map((option, optionIndex) => sourceKey.includes(option.id) ? optionIndex : -1).filter((optionIndex) => optionIndex >= 0)
      : [];
    const expectedAnswers = expectedIndexes.map((optionIndex) => String.fromCharCode(65 + optionIndex));
    assert.deepEqual(importedQuestion.answers, expectedAnswers, `${context}: answer key`);
    assert.deepEqual(importedQuestion.options.map((option) => option.isCorrect), original.options.map((_, optionIndex) => expectedIndexes.includes(optionIndex)), `${context}: answer flags`);
    assert.equal(audit.resolution.optionEvaluations.length, original.options.length, `${context}: one audited rationale per option`);

    for (const evaluation of audit.resolution.optionEvaluations) {
      const previousEvaluation = previous.resolution.optionEvaluations.find((item) => item.optionId === evaluation.optionId);
      assert.ok(previousEvaluation, `${context}: rationale option ID exists in V2`);
      if (evaluation.rationale !== previousEvaluation.rationale) {
        changedRationales.push(`${original.extractionPosition}:${evaluation.optionId}`);
      }
    }

    for (let optionIndex = 0; optionIndex < original.options.length; optionIndex += 1) {
      const expectedRationale = audit.resolution.optionEvaluations[optionIndex].rationale;
      const parsedRationale = parsedQuestion.options[optionIndex].justification || "";
      const importedRationale = importedQuestion.options[optionIndex].justification || "";
      assert.ok(parsedRationale.includes(expectedRationale), `${context}: parsed rationale ${optionIndex + 1}`);
      assert.ok(importedRationale.includes(expectedRationale), `${context}: imported rationale ${optionIndex + 1}`);
      rationaleCount += Number(Boolean(importedRationale.trim()));
    }

    if (verified) {
      verifiedCount += 1;
      assert.ok(expectedAnswers.length > 0, `${context}: verified question has an answer`);
    } else {
      unscoredCount += 1;
      assert.deepEqual(expectedAnswers, [], `${context}: unscored question has no key`);
      assert.ok(importedQuestion.options.every((option) => !option.isCorrect), `${context}: unscored options remain neutral`);
    }

    if (original.responseType === "multiple") multipleCount += 1;
    if (shouldWarn) {
      actualWarningPositions.push(original.extractionPosition);
      assert.equal(visiblePrompt.endsWith(ojoSuffix), true, `${context}: exact OJO suffix`);
    } else {
      assert.equal(visiblePrompt.includes(ojoSuffix), false, `${context}: no extra OJO suffix`);
    }

    optionsCount += original.options.length;
    assert.equal(original.images.length <= 1, true, `${context}: importer supports at most one image per question`);
    const expectedImage = original.images[0];
    if (expectedImage) {
      imageReferences += 1;
      const expectedBytes = await readFile(path.join(contentDirectory, expectedImage.file));
      assert.equal(createHash("sha256").update(expectedBytes).digest("hex"), expectedImage.sha256, `${context}: source image hash`);
      assert.equal(imageDigest(importedQuestion.image), expectedImage.sha256, `${context}: imported image bytes`);
      uniqueImages.add(expectedImage.sha256);
    } else {
      assert.equal(importedQuestion.image, null, `${context}: no unexpected image`);
    }
  }

  assert.deepEqual(changedRationales.sort(), [
    "10:option-2", "10:option-4", "112:option-1", "112:option-2", "112:option-3",
    "119:option-1", "119:option-3", "24:option-1", "25:option-1", "26:option-2"
  ].sort(), "only the ten documented option rationales may change from V2");

  assert.deepEqual(actualWarningPositions, ojoPositions);
  assert.equal(optionsCount, 585);
  assert.equal(verifiedCount, 123);
  assert.equal(unscoredCount, 9);
  assert.equal(multipleCount, 15);
  assert.equal(imageReferences, 40);
  assert.equal(uniqueImages.size, 15);
  assert.equal(rationaleCount, 585);
  assert.deepEqual(summarizeQuiz(imported.questions, 0), {
    presentedCount: 132,
    scoreableCount: 123,
    unscoredCount: 9,
    correctCount: 0
  });

  for (const position of [41, 66, 67]) {
    const question = resolved.questions[position - 1];
    assert.equal(question.resolution.status, "PROVISIONAL");
    assert.equal(question.presentationSuffix, undefined, `provisional question ${position} must not receive an OJO label`);
  }
});
