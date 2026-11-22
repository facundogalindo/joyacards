import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { areAnswersCorrect, summarizeQuiz } from "../src/utils/quizUtils.js";

const require = createRequire(import.meta.url);
const { convertWordToJson } = require("../../backend/src/services/wordToJson.service.js");
const documentUrl = new URL("../../content/redes-parcial-3-2026/Redes_Parcial_3_2026_JoyaCards_Auditado.docx", import.meta.url);
const netstatPrompt = "La ejecución de un comando nos permite ver los puertos de los servicios que funcionan en el equipo, ¿Qué servicios puede asegurar que están corriendo en el servidor?";
const netstatOptions = ["SSH", "FTP", "DNS", "HTTPS", "DHCP", "HTTP", "Telnet"];
const variantAnnotation = "VARIANTE DEL PARCIAL (RECUERDO): Imaginá que la última entrada, correspondiente a UDP en el puerto 8280, presenta el campo ESTADO vacío. Las entradas TCP de los puertos 22 y 443 permanecen en LISTEN. Teniendo en cuenta ese cambio, respondé la misma consigna original.";

test("the main Networks DOCX imports 30 scored cards with two reconstructed netstat keys", async () => {
  const result = await convertWordToJson(await readFile(documentUrl), { shuffle: false });
  const scored = result.questions.filter((question) => question.isUnscored !== true);
  const unscored = result.questions.filter((question) => question.isUnscored === true);

  assert.equal(result.total, 30);
  assert.equal(scored.length, 30);
  assert.equal(unscored.length, 0);
  assert.equal(result.justificationCount, 32);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.questions.filter((question) => question.hasImage).length, 9);
  assert.deepEqual(summarizeQuiz(result.questions, 30), {
    presentedCount: 30,
    scoreableCount: 30,
    unscoredCount: 0,
    correctCount: 30
  });

  const original = result.questions.find((question) => question.question.includes("[FOTO | NETSTAT ORIGINAL | CLAVE DE PRÁCTICA RECONSTRUIDA]"));
  const variant = result.questions.find((question) => question.question.includes("[RECUERDO | VARIANTE NETSTAT | CLAVE DE PRÁCTICA RECONSTRUIDA]"));
  assert.ok(original);
  assert.ok(variant);

  for (const question of [original, variant]) {
    assert.ok(question.question.endsWith(netstatPrompt));
    assert.equal(question.type, "multiple_choice");
    assert.equal(question.hasImage, true);
    assert.match(question.image, /^data:image\/jpeg;base64,/);
    assert.deepEqual(question.options.map((option) => option.text), netstatOptions);
    assert.deepEqual(question.answers, ["A", "D"]);
    assert.deepEqual(
      question.options.filter((option) => option.isCorrect).map((option) => option.text),
      ["SSH", "HTTPS"]
    );
    assert.ok(question.options.filter((option) => option.isCorrect).every((option) => option.justification));
  }

  assert.equal(original.image, variant.image);
  assert.equal(original.afterImageText, undefined);
  assert.equal(variant.afterImageText, variantAnnotation);
  assert.ok(original.options.find((option) => option.text === "SSH").justification.includes("clave es una reconstrucción para practicar"));
  assert.ok(variant.options.find((option) => option.text === "HTTPS").justification.includes("UDP no utiliza el estado TCP LISTEN"));
  assert.ok(variant.options.find((option) => option.text === "HTTPS").justification.includes("supuesto de práctica"));
  assert.equal(areAnswersCorrect(["A", "D"], original.answers), true);
  assert.equal(areAnswersCorrect(["D", "A"], original.answers), true);
  assert.equal(areAnswersCorrect(["A"], original.answers), false);
  assert.equal(areAnswersCorrect(["D"], variant.answers), false);
  assert.equal(areAnswersCorrect(["A", "D", "F"], variant.answers), false);
  assert.equal(result.questions.some((question) => question.question.includes("SIN PUNTUAR")), false);
});
