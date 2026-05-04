function normalizeWordText(rawText) {
  return rawText
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/(\d+[\).]\s*)/g, "\n$1")
    .replace(/(\*?\s*[a-zA-Z][\).]\s*)/g, "\n$1");
}

function getLinesFromWordText(rawText) {
  return normalizeWordText(rawText)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

module.exports = {
  normalizeWordText,
  getLinesFromWordText
};