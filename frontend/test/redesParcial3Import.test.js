import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { convertWordToJson } = require("../../backend/src/services/wordToJson.service.js");
const documentUrl = new URL("../../content/redes-parcial-3-2026/Redes_Parcial_3_2026_JoyaCards_Auditado.docx", import.meta.url);
const netstatPrompt = "La ejecución de un comando nos permite ver los puertos de los servicios que funcionan en el equipo, ¿Qué servicios puede asegurar que están corriendo en el servidor?";
const netstatOptions = ["SSH", "FTP", "DNS", "HTTPS", "DHCP", "HTTP", "Telnet"];
const variantAnnotation = "VARIANTE DEL PARCIAL (RECUERDO): Imaginá que, en una de las filas de la consola, el campo ESTADO aparece vacío en lugar de mostrar LISTEN. El resto de la captura permanece igual. Teniendo en cuenta ese cambio, respondé la misma consigna original.";

test("the main Networks DOCX imports 28 scored and two unscored netstat cards", async () => {
  const result = await convertWordToJson(await readFile(documentUrl), { shuffle: false });
  const scored = result.questions.filter((question) => question.isUnscored !== true);
  const unscored = result.questions.filter((question) => question.isUnscored === true);

  assert.equal(result.total, 30);
  assert.equal(scored.length, 28);
  assert.equal(unscored.length, 2);
  assert.equal(result.justificationCount, 28);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.questions.filter((question) => question.hasImage).length, 9);
  assert.ok(scored.every((question) => question.options.filter((option) => option.isCorrect).length === 1));

  const original = unscored.find((question) => question.question.includes("[FOTO | NETSTAT ORIGINAL | SIN PUNTUAR]"));
  const variant = unscored.find((question) => question.question.includes("[RECUERDO | VARIANTE NETSTAT | SIN PUNTUAR]"));
  assert.ok(original);
  assert.ok(variant);

  for (const question of [original, variant]) {
    assert.ok(question.question.endsWith(netstatPrompt));
    assert.equal(question.type, "multiple_choice");
    assert.equal(question.hasImage, true);
    assert.match(question.image, /^data:image\/jpeg;base64,/);
    assert.deepEqual(question.options.map((option) => option.text), netstatOptions);
    assert.ok(question.options.every((option) => option.isCorrect === false));
    assert.deepEqual(question.answers, []);
  }

  assert.equal(original.image, variant.image);
  assert.equal(original.afterImageText, undefined);
  assert.equal(variant.afterImageText, variantAnnotation);
});
