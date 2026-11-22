import test from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(testDirectory, "../..");
const auditDirectory = path.join(repositoryRoot, "content", "redes-parcial-3-2026");
const imageAudit = JSON.parse(
  await readFile(path.join(auditDirectory, "AUDITORIA_IMAGENES.json"), "utf8")
);
const documentPath = path.join(
  auditDirectory,
  "Redes_Parcial_3_2026_JoyaCards_Auditado.docx"
);
const EXPECTED_SEMANTIC_DIGEST =
  "9e9efc0a2741bdc58fcb04bb34a80f3aa9128706d1ccf72c5e9ac071968eeb3e";

const require = (await import("node:module")).createRequire(import.meta.url);
const { convertWordToJson } = require("../../backend/src/services/wordToJson.service.js");

function imageDigest(dataUrl) {
  return dataUrl
    ? createHash("sha256")
        .update(Buffer.from(dataUrl.split(",")[1], "base64"))
        .digest("hex")
    : null;
}

function semanticQuestion(question) {
  return {
    type: question.type,
    question: question.question,
    afterImageText: question.afterImageText || null,
    isUnscored: question.isUnscored === true,
    answers: question.answers || [],
    options: (question.options || []).map((option) => ({
      letter: option.letter,
      text: option.text,
      isCorrect: option.isCorrect,
      justification: option.justification || ""
    })),
    items: question.items || [],
    imageDigest: imageDigest(question.image)
  };
}

async function fileHash(relativePath) {
  const bytes = await readFile(path.join(auditDirectory, relativePath));
  return createHash("sha256").update(bytes).digest("hex");
}

test("the imported Networks DOCX matches the preserved 30-card semantic baseline", async () => {
  const result = await convertWordToJson(await readFile(documentPath), {
    shuffle: false
  });
  const semanticQuestions = result.questions.map(semanticQuestion);
  const digest = createHash("sha256")
    .update(JSON.stringify(semanticQuestions))
    .digest("hex");

  assert.equal(result.total, 30);
  assert.equal(result.questions.filter((question) => question.isUnscored !== true).length, 30);
  assert.equal(result.questions.filter((question) => question.isUnscored === true).length, 0);
  assert.equal(result.justificationCount, 32);
  assert.equal(result.warnings.length, 0);
  assert.equal(semanticQuestions.filter((question) => question.imageDigest).length, 9);
  assert.equal(digest, EXPECTED_SEMANTIC_DIGEST);
  assert.equal(imageAudit.questionnaireBaseline.semanticSha256, EXPECTED_SEMANTIC_DIGEST);
});

test("every embedded picture has an exact original photo and an audited reconstruction status", async () => {
  const result = await convertWordToJson(await readFile(documentPath), {
    shuffle: false
  });
  const questionImages = result.questions
    .map((question) => imageDigest(question.image))
    .filter(Boolean);
  const distinctDigests = [...new Set(questionImages)].sort();

  assert.equal(imageAudit.entries.length, 5);
  assert.equal(questionImages.length, 9);
  assert.deepEqual(
    distinctDigests,
    imageAudit.entries.map((entry) => entry.embeddedImageSha256).sort()
  );

  for (const entry of imageAudit.entries) {
    assert.ok(["APROBADA", "PARCIAL", "NO RECONSTRUIBLE"].includes(entry.reconstructionStatus));
    assert.equal(
      await fileHash(entry.originalPhotoFile),
      entry.originalPhotoSha256,
      entry.id + ": original photo hash"
    );

    if (entry.enhancedImageFile) {
      assert.equal(
        await fileHash(entry.enhancedImageFile),
        entry.enhancedImageSha256,
        entry.id + ": enhanced image hash"
      );
      assert.ok(entry.enhancementComparisonFile);
      await readFile(path.join(auditDirectory, entry.enhancementComparisonFile));
    }

    if (entry.reconstructionStatus === "APROBADA") {
      assert.ok(entry.reconstructionFile);
      assert.ok(entry.comparisonFile);
      const source = await readFile(path.join(auditDirectory, entry.reconstructionFile), "utf8");
      await readFile(path.join(auditDirectory, entry.comparisonFile));
      assert.match(source, /<svg\b/);
    } else {
      assert.equal(entry.reconstructionFile, null);
      assert.equal(entry.comparisonFile, null);
    }
  }

  assert.equal(
    imageAudit.entries.find((entry) => entry.id === "netstat").reconstructionStatus,
    "NO RECONSTRUIBLE"
  );
  assert.equal(
    imageAudit.entries.find((entry) => entry.id === "show-ip-route").reconstructionStatus,
    "NO RECONSTRUIBLE"
  );
});