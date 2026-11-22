import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AlignmentType,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  TextRun
} from "docx";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../..");
const contentDirectory = path.join(repositoryRoot, "content", "redes-parcial-3-2026");
const assetDirectory = path.join(contentDirectory, "assets");
const outputFile = path.join(contentDirectory, "Redes_Parcial_3_2026_JoyaCards_Auditado.docx");
const letter = "abcdefghijklmnopqrstuvwxyz";

async function loadCards(fileName) {
  const fileText = await readFile(path.join(contentDirectory, fileName), "utf8");
  return JSON.parse(fileText.replace(/^\uFEFF/, ""));
}

function getJpegDimensions(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    throw new Error("El archivo de imagen no tiene firma JPEG");
  }

  const frameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > buffer.length) break;

    const segmentLength = buffer.readUInt16BE(offset);
    if (frameMarkers.has(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5)
      };
    }
    offset += segmentLength;
  }

  throw new Error("No se pudieron leer las dimensiones JPEG");
}

function paragraph(text, settings = {}) {
  return new Paragraph({
    keepNext: Boolean(settings.keepNext),
    keepLines: true,
    spacing: { after: settings.after ?? 75, line: 260 },
    children: [new TextRun({
      text,
      bold: Boolean(settings.bold),
      italics: Boolean(settings.italics),
      color: settings.color || "20252D",
      size: settings.size || 20,
      font: "Arial"
    })]
  });
}

async function imageParagraph(imageName) {
  const bytes = await readFile(path.join(assetDirectory, imageName));
  const dimensions = getJpegDimensions(bytes);
  const scale = Math.min(560 / dimensions.width, 360 / dimensions.height, 1);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    keepNext: true,
    keepLines: true,
    spacing: { before: 40, after: 120 },
    children: [new ImageRun({
      data: bytes,
      type: "jpg",
      transformation: {
        width: Math.round(dimensions.width * scale),
        height: Math.round(dimensions.height * scale)
      }
    })]
  });
}

function justification(card) {
  return [
    "Procedencia: " + card.source,
    "Justificación: " + card.rationale,
    "Fuente: " + card.references,
    "Confianza: " + card.confidence,
    "Reconstrucción: " + card.reconstruction
  ].join("\n");
}

async function main() {
  const cardGroups = await Promise.all([
    loadCards("cards-fotos-1.json"),
    loadCards("cards-fotos-2.json"),
    loadCards("cards-reconstruidas.json")
  ]);
  const cards = cardGroups.flat();

  if (cards.length !== 23) {
    throw new Error("Se esperaban 23 tarjetas puntuables, se encontraron " + cards.length);
  }

  const children = [];
  for (let index = 0; index < cards.length; index += 1) {
    const card = cards[index];
    const correctCount = card.options.filter((option) => option.correct).length;
    if (correctCount !== 1) {
      throw new Error("La tarjeta " + (index + 1) + " debe tener exactamente una respuesta correcta");
    }

    const prompt = (card.tag ? card.tag + " " : "") + card.prompt;
    children.push(paragraph(card.marker + " " + (index + 1) + ". " + prompt, {
      bold: true,
      size: 22,
      after: 90,
      keepNext: true
    }));

    if (card.image) {
      children.push(paragraph("[[IMAGEN]]", { color: "606B79", size: 16, after: 20, keepNext: true }));
      children.push(await imageParagraph(card.image));
      if (card.afterImageText) {
        children.push(paragraph(card.afterImageText, { after: 70, keepNext: true }));
      }
    }

    card.options.forEach((option, optionIndex) => {
      children.push(paragraph(letter[optionIndex] + ") " + option.text + (option.correct ? " *" : ""), {
        after: 55,
        keepNext: optionIndex < card.options.length - 1 || option.correct
      }));

      if (option.correct) {
        children.push(paragraph("[[JUSTIFICACION]]", { color: "737D8A", size: 16, after: 20, keepNext: true }));
        children.push(paragraph(justification(card), { color: "46505C", size: 18, after: 55, keepNext: true }));
        children.push(paragraph("[[FIN_JUSTIFICACION]]", { color: "737D8A", size: 16, after: 75, keepNext: true }));
      }
    });

    children.push(new Paragraph({
      spacing: { after: 130 },
      children: [new TextRun("")]
    }));
  }

  const document = new Document({
    creator: "JoyaCards content audit",
    title: "Redes - tercer parcial 2026 - cuestionario auditado",
    description: "Cuestionario en formato nativo importable de JoyaCards",
    sections: [{
      properties: {
        page: { margin: { top: 850, right: 850, bottom: 850, left: 850 } }
      },
      children
    }]
  });

  await writeFile(outputFile, await Packer.toBuffer(document));
  console.log("Generado: " + outputFile);
  console.log("Tarjetas puntuables: " + cards.length);
  console.log("Imágenes insertadas: " + cards.filter((card) => card.image).length);
}

await main();
