const test = require("node:test");
const assert = require("node:assert/strict");
const JSZip = require("jszip");
const {
  convertWordToJson,
  parseHtmlToQuestions,
  formatQuestionsWithoutShuffle,
  randomizeQuestionOptions
} = require("../src/services/wordToJson.service");

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function createDocx(lines) {
  const zip = new JSZip();
  const paragraphs = lines
    .map(
      (line) =>
        `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`
    )
    .join("");

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    </Types>`
  );
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
    </Relationships>`
  );
  zip.file(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}<w:sectPr/></w:body></w:document>`
  );

  return zip.generateAsync({ type: "nodebuffer" });
}

async function importLines(lines, options = { shuffle: false }) {
  return convertWordToJson(await createDocx(lines), options);
}

test("imports an old Word document without justifications", async () => {
  const result = await importLines([
    "1. Capital de Argentina",
    "a) Córdoba",
    "b) Buenos Aires *"
  ]);

  assert.equal(result.total, 1);
  assert.equal(result.justificationCount, 0);
  assert.deepEqual(result.warnings, []);
  assert.deepEqual(result.questions[0].answers, ["B"]);
  assert.equal(result.questions[0].options[1].text, "Buenos Aires");
});

test("parses both justification markers and preserves multiple lines", async () => {
  const result = await importLines([
    "@@ 1. What uses TCP port 80?",
    "a) HTTP *",
    "[[JUSTIFICACION]]",
    "HTTP uses TCP.",
    "The standard port is 80.",
    "[[FIN_JUSTIFICACION]]"
  ]);

  assert.equal(result.justificationCount, 1);
  assert.equal(
    result.questions[0].options[0].justification,
    "HTTP uses TCP.\nThe standard port is 80."
  );
});

test("preserves soft line breaks inside a Word paragraph", () => {
  const parsed = parseHtmlToQuestions(
    "<p>@@ 1. Which protocol?</p><p>a) HTTP *</p><p>[[JUSTIFICACION]]</p><p>HTTP uses TCP.<br/>Its standard port is 80.</p><p>[[FIN_JUSTIFICACION]]</p>"
  );

  assert.equal(
    parsed.questions[0].options[0].justification,
    "HTTP uses TCP.\nIts standard port is 80."
  );
});

test("attaches explanations to correct and incorrect alternatives", async () => {
  const result = await importLines([
    "@@ 7. Which answer is right?",
    "a) Wrong",
    "[[JUSTIFICACION]]",
    "This alternative is wrong.",
    "[[FIN_JUSTIFICACION]]",
    "b) Right *",
    "[[JUSTIFICACION]]",
    "This alternative is right.",
    "[[FIN_JUSTIFICACION]]"
  ]);

  assert.equal(result.justificationCount, 2);
  assert.equal(result.questions[0].options[0].isCorrect, false);
  assert.equal(result.questions[0].options[0].justification, "This alternative is wrong.");
  assert.equal(result.questions[0].options[1].isCorrect, true);
  assert.equal(result.questions[0].options[1].justification, "This alternative is right.");
});

test("ignores an empty justification block without warning", async () => {
  const result = await importLines([
    "@@ 2. Empty explanation",
    "a) Right *",
    "[[JUSTIFICACION]]",
    "[[FIN_JUSTIFICACION]]"
  ]);

  assert.equal(result.justificationCount, 0);
  assert.deepEqual(result.warnings, []);
  assert.equal("justification" in result.questions[0].options[0], false);
});

test("ignores an unclosed block, reports the source question, and keeps parsing", async () => {
  const result = await importLines([
    "@@ 12. Broken block",
    "a) First *",
    "[[JUSTIFICACION]]",
    "First block never closes.",
    "b) Second",
    "[[JUSTIFICACION]]",
    "This explanation is still valid.",
    "[[FIN_JUSTIFICACION]]"
  ]);

  assert.equal(result.total, 1);
  assert.equal(result.justificationCount, 1);
  assert.equal(result.questions[0].options[1].justification, "This explanation is still valid.");
  assert.equal(result.warnings.length, 1);
  assert.equal(result.warnings[0].type, "unclosed_justification");
  assert.equal(result.warnings[0].questionNumber, 12);
  assert.equal(result.warnings[0].option, "A");
});

test("keeps the first duplicate and reports the duplicate warning", async () => {
  const result = await importLines([
    "@@ 13. Duplicate block",
    "a) Right *",
    "[[JUSTIFICACION]]",
    "First explanation.",
    "[[FIN_JUSTIFICACION]]",
    "[[JUSTIFICACION]]",
    "Second explanation.",
    "[[FIN_JUSTIFICACION]]"
  ]);

  assert.equal(result.questions[0].options[0].justification, "First explanation.");
  assert.equal(result.justificationCount, 1);
  assert.equal(result.warnings[0].type, "duplicate_justification");
  assert.equal(result.warnings[0].questionNumber, 13);
});

test("reports a closing marker without an opening marker", async () => {
  const result = await importLines([
    "@@ 14. Unexpected ending",
    "a) Correct *",
    "[[FIN_JUSTIFICACION]]"
  ]);

  assert.equal(result.warnings.length, 1);
  assert.equal(result.warnings[0].type, "unexpected_justification_end");
  assert.equal(result.warnings[0].questionNumber, 14);
});

test("warning question indices refer to the filtered question list", async () => {
  const result = await importLines([
    "@@ 20. First valid question",
    "a) Correct *",
    "[[JUSTIFICACION]]",
    "Bad block",
    "b) Also valid",
    "@@ 21. Valid question",
    "a) Correct *",
    "[[JUSTIFICACION]]",
    "Valid block",
    "[[FIN_JUSTIFICACION]]"
  ]);

  assert.equal(result.total, 2);
  assert.equal(result.justificationCount, 1);
  assert.equal(result.warnings[0].questionNumber, 20);
  assert.equal(result.warnings[0].questionIndex, 0);
});

test("counts only nonempty, associated explanations once", async () => {
  const result = await importLines([
    "@@ 22. Count explanations",
    "a) Correct *",
    "[[JUSTIFICACION]]",
    "First explanation",
    "[[FIN_JUSTIFICACION]]",
    "[[JUSTIFICACION]]",
    "Duplicate explanation",
    "[[FIN_JUSTIFICACION]]",
    "b) Incorrect",
    "[[JUSTIFICACION]]",
    "[[FIN_JUSTIFICACION]]"
  ]);

  assert.equal(result.justificationCount, 1);
  assert.equal(result.warnings.length, 1);
});

test("supports true/false explanations for each answer", async () => {
  const result = await importLines([
    "@ 1. DNS usually uses port 53.",
    "a) Verdadero *",
    "[[JUSTIFICACION]]",
    "This statement is true.",
    "[[FIN_JUSTIFICACION]]",
    "b) Falso",
    "[[JUSTIFICACION]]",
    "This statement is false.",
    "[[FIN_JUSTIFICACION]]"
  ]);

  assert.equal(result.questions[0].type, "true_false");
  assert.deepEqual(result.questions[0].answers, ["A"]);
  assert.equal(result.justificationCount, 2);
});

test("supports single choice", async () => {
  const result = await importLines([
    "@@ 2. Single choice",
    "a) Answer *",
    "b) Other"
  ]);

  assert.equal(result.questions[0].type, "single_choice");
  assert.deepEqual(result.questions[0].answers, ["A"]);
});

test("supports multiple choice with explanations on selected answers", async () => {
  const result = await importLines([
    "@@@ 3. Multiple choice",
    "a) First *",
    "[[JUSTIFICACION]]",
    "First reason",
    "[[FIN_JUSTIFICACION]]",
    "b) Second",
    "c) Third *"
  ]);

  assert.equal(result.questions[0].type, "multiple_choice");
  assert.deepEqual(result.questions[0].answers, ["A", "C"]);
  assert.equal(result.justificationCount, 1);
});

test("does not attach justifications to drag-words questions", async () => {
  const result = await importLines([
    "@@@@@ 4. Drag words",
    "a) Dragged option *",
    "[[JUSTIFICACION]]",
    "This marker is outside the supported types.",
    "[[FIN_JUSTIFICACION]]"
  ]);

  assert.equal(result.questions[0].type, "drag_words");
  assert.equal(result.justificationCount, 0);
  assert.equal("justification" in result.questions[0].options[0], false);
  assert.equal(result.warnings[0].type, "unsupported_justification_type");
});

test("supports three free multi-dropdown options and preserves each reason", async () => {
  const result = await importLines([
    "@@@@ 5. Complete the sentence",
    "1) DNS uses [TCP / UDP* / Both]",
    "[[JUSTIFICACION_ITEM_1_OPCION_1]]",
    "TCP is not the expected choice.",
    "[[FIN_JUSTIFICACION]]",
    "[[JUSTIFICACION_ITEM_1_OPCION_2]]",
    "UDP is correct.",
    "[[FIN_JUSTIFICACION]]",
    "[[JUSTIFICACION_ITEM_1_OPCION_3]]",
    "Both is incorrect.",
    "[[FIN_JUSTIFICACION]]"
  ]);

  const item = result.questions[0].items[0];
  assert.equal(result.questions[0].type, "multi_dropdown");
  assert.deepEqual(item.options.map((option) => option.text), ["TCP", "UDP", "Both"]);
  assert.equal(item.answer, "UDP");
  assert.equal(item.answerOptionId, item.options[1].id);
  assert.equal(result.justificationCount, 3);
});

test("keeps the original multi-dropdown Word syntax working", async () => {
  const result = await importLines([
    "@@@@ 2. Old dropdown format",
    "1) DNS uses [Verdadero / Falso*]"
  ]);
  const item = result.questions[0].items[0];

  assert.equal(result.total, 1);
  assert.equal(result.justificationCount, 0);
  assert.deepEqual(item.options.map((option) => option.text), ["Verdadero", "Falso"]);
  assert.equal(item.answer, "Falso");
});

test("supports multiple multi-dropdown items and item/option marker mapping", async () => {
  const result = await importLines([
    "@@@@ 6. Complete both",
    "1) First [A* / B]",
    "[[JUSTIFICACION_ITEM_1_OPCION_2]]",
    "Reason for B",
    "[[FIN_JUSTIFICACION]]",
    "2) Second [C / D*]",
    "[[JUSTIFICACION_ITEM_2_OPCION_1]]",
    "Reason for C",
    "[[FIN_JUSTIFICACION]]"
  ]);

  const [first, second] = result.questions[0].items;
  assert.equal(first.options[1].justification, "Reason for B");
  assert.equal(second.options[0].justification, "Reason for C");
  assert.equal(result.justificationCount, 2);
});

test("multi-dropdown duplicate explanations keep the first and warn", async () => {
  const result = await importLines([
    "@@@@ 7. Duplicate dropdown reason",
    "1) Pick [A* / B]",
    "[[JUSTIFICACION_ITEM_1_OPCION_2]]",
    "First",
    "[[FIN_JUSTIFICACION]]",
    "[[JUSTIFICACION_ITEM_1_OPCION_2]]",
    "Second",
    "[[FIN_JUSTIFICACION]]"
  ]);

  assert.equal(result.questions[0].items[0].options[1].justification, "First");
  assert.equal(result.warnings[0].itemId, 1);
  assert.equal(result.warnings[0].optionIndex, 1);
});

test("formatting without shuffle retains IDs, correctness, and explanations", async () => {
  const result = await importLines([
    "@@ 8. Preserve metadata",
    "a) Duplicate *",
    "[[JUSTIFICACION]]",
    "Correct one",
    "[[FIN_JUSTIFICACION]]",
    "b) Duplicate",
    "[[JUSTIFICACION]]",
    "Incorrect one",
    "[[FIN_JUSTIFICACION]]"
  ]);
  const formatted = result.questions[0];

  assert.notEqual(formatted.options[0].id, formatted.options[1].id);
  assert.equal(formatted.options[0].isCorrect, true);
  assert.equal(formatted.options[0].justification, "Correct one");
  assert.equal(formatted.options[1].isCorrect, false);
  assert.equal(formatted.options[1].justification, "Incorrect one");
});

test("shuffle keeps option identity with correctness when texts are duplicates", async () => {
  const result = await importLines([
    "@@ 9. Duplicate text",
    "a) Same *",
    "[[JUSTIFICACION]]",
    "Reason for correct choice",
    "[[FIN_JUSTIFICACION]]",
    "b) Same",
    "[[JUSTIFICACION]]",
    "Reason for incorrect choice",
    "[[FIN_JUSTIFICACION]]"
  ]);
  const raw = parseHtmlToQuestions(
    `<p>@@ 9. Duplicate text</p><p>a) Same *</p><p>[[JUSTIFICACION]]</p><p>Reason for correct choice</p><p>[[FIN_JUSTIFICACION]]</p><p>b) Same</p><p>[[JUSTIFICACION]]</p><p>Reason for incorrect choice</p><p>[[FIN_JUSTIFICACION]]</p>`
  ).questions[0];
  const originalRandom = Math.random;
  Math.random = () => 0;
  const shuffled = randomizeQuestionOptions(raw);
  Math.random = originalRandom;

  const correct = shuffled.options.find((option) => option.isCorrect);
  assert.equal(result.questions[0].options[0].text, "Same");
  assert.equal(correct.justification, "Reason for correct choice");
  assert.equal(shuffled.answers[0], correct.letter);
  assert.equal(shuffled.options[0].text, "Same");
  assert.equal(shuffled.options[0].justification, "Reason for incorrect choice");
});

test("question shuffle retains alternative metadata", async () => {
  const result = await importLines([
    "@@ 10. Shuffle metadata",
    "a) One *",
    "[[JUSTIFICACION]]",
    "Reason one",
    "[[FIN_JUSTIFICACION]]",
    "b) Two",
    "[[JUSTIFICACION]]",
    "Reason two",
    "[[FIN_JUSTIFICACION]]"
  ]);
  const raw = parseHtmlToQuestions(
    "<p>@@ 10. Shuffle metadata</p><p>a) One *</p><p>[[JUSTIFICACION]]</p><p>Reason one</p><p>[[FIN_JUSTIFICACION]]</p><p>b) Two</p><p>[[JUSTIFICACION]]</p><p>Reason two</p><p>[[FIN_JUSTIFICACION]]</p>"
  ).questions[0];
  const previousRandom = Math.random;
  Math.random = () => 0;
  const shuffled = randomizeQuestionOptions(raw);
  Math.random = previousRandom;

  assert.equal(shuffled.options[1].text, "One");
  assert.equal(shuffled.options[1].justification, "Reason one");
  assert.equal(shuffled.answers[0], "B");
  assert.equal(result.justificationCount, 2);
});

test("validates formatted question objects without dropping justification data", async () => {
  const result = await importLines([
    "@@ 11. Reformat",
    "a) Right *",
    "[[JUSTIFICACION]]",
    "Reason",
    "[[FIN_JUSTIFICACION]]"
  ]);
  const reparsed = parseHtmlToQuestions(
    "<p>@@ 11. Reformat</p><p>a) Right *</p><p>[[JUSTIFICACION]]</p><p>Reason</p><p>[[FIN_JUSTIFICACION]]</p>"
  ).questions;
  const formatted = formatQuestionsWithoutShuffle(reparsed)[0];

  assert.equal(formatted.options[0].justification, "Reason");
  assert.equal(formatted.options[0].isCorrect, true);
  assert.equal(result.total, 1);
});
