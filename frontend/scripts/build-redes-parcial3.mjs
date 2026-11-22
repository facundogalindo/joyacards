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
const pendingOutputFile = path.join(contentDirectory, "Pendientes_Redes_Parcial_3_2026_Practica_Sin_Puntuar.docx");
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
    pageBreakBefore: Boolean(settings.pageBreakBefore),
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

function variantAnnotationParagraph(text) {
  const label = "VARIANTE DEL PARCIAL (RECUERDO):";
  const labelText = text.startsWith(label) ? label + " " : "";
  const bodyText = labelText ? text.slice(labelText.length) : text;
  return new Paragraph({
    keepLines: true,
    indent: { left: 120, right: 120 },
    spacing: { after: 100, line: 260 },
    children: [
      ...(labelText ? [new TextRun({ text: labelText, bold: true, color: "46505C", size: 18, font: "Arial" })] : []),
      new TextRun({ text: bodyText, color: "46505C", size: 18, font: "Arial" })
    ]
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
  const pendingCards = await loadCards("cards-pendientes.json");

  if (cards.length === 0) {
    throw new Error("No hay tarjetas puntuables para generar el cuestionario");
  }

  const invalidCards = cards
    .map((card, index) => ({
      index: index + 1,
      card,
      correctCount: Array.isArray(card.options)
        ? card.options.filter((option) => option.correct).length
        : 0
    }))
    .filter(({ card, correctCount }) => !card.prompt || !Array.isArray(card.options) || correctCount !== 1);

  if (invalidCards.length > 0) {
    throw new Error("Tarjetas inválidas: " + invalidCards.map(({ index }) => index).join(", "));
  }

  const children = [];
  for (let index = 0; index < cards.length; index += 1) {
    const card = cards[index];
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
      const optionLetter = card.optionLetterCase === "upper"
        ? letter[optionIndex].toUpperCase()
        : letter[optionIndex];
      children.push(paragraph(optionLetter + ") " + option.text + (option.correct ? " *" : ""), {
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

  const pendingChildren = [
    paragraph("Redes tercer parcial 2026 preguntas pendientes", { bold: true, size: 32, after: 180 }),
    paragraph("Material de práctica sin puntuar. Se conservan el enunciado, las opciones conocidas y la captura original; no se asigna una respuesta correcta cuando la evidencia no permite comprobarla.", { size: 20, after: 220 })
  ];

  for (let index = 0; index < pendingCards.length; index += 1) {
    const card = pendingCards[index];
    if (!card.prompt || !Array.isArray(card.options) || card.options.length === 0) {
      throw new Error("Ejercicio pendiente inválido: " + (card.id || index + 1));
    }

    pendingChildren.push(paragraph(card.title, {
      bold: true,
      size: 24,
      after: 100,
      keepNext: true,
      pageBreakBefore: index > 0
    }));
    pendingChildren.push(paragraph((card.label || "[PENDIENTE | NO PUNTUAR]") + " " + card.source, {
      size: 17,
      color: "8A4B08",
      after: 80,
      keepNext: true
    }));
    pendingChildren.push(paragraph(card.prompt, { bold: true, size: 22, after: 90, keepNext: true }));
    pendingChildren.push(paragraph("[[CAPTURA ORIGINAL]]", { color: "606B79", size: 16, after: 20, keepNext: true }));
    pendingChildren.push(await imageParagraph(card.image));
    if (card.afterImageText) {
      pendingChildren.push(variantAnnotationParagraph(card.afterImageText));
    }
    if (card.imageCaption) {
      pendingChildren.push(paragraph(card.imageCaption, { size: 17, after: 90, keepNext: true }));
    }
    pendingChildren.push(paragraph("Opciones", { bold: true, size: 20, after: 55, keepNext: true }));
    card.options.forEach((option, optionIndex) => {
      pendingChildren.push(paragraph(String.fromCharCode(65 + optionIndex) + ") " + option, {
        after: 45,
        keepNext: optionIndex < card.options.length - 1
      }));
    });
    pendingChildren.push(paragraph("Respuesta para revisar: ______________________________________________", { after: 80 }));
    pendingChildren.push(paragraph("Observaciones", { bold: true, size: 19, after: 50, keepNext: true }));
    card.notes.forEach((note) => pendingChildren.push(paragraph(note, { size: 18, after: 55 })));
    pendingChildren.push(paragraph("Fuente: " + card.references, { size: 16, color: "46505C", after: 100 }));
  }

  const pendingDocument = new Document({
    creator: "JoyaCards content audit",
    title: "Redes tercer parcial 2026 preguntas pendientes",
    description: "Companion de práctica sin respuestas puntuables para consignas cuya evidencia no permite asignar una clave",
    sections: [{
      properties: {
        page: { margin: { top: 850, right: 850, bottom: 850, left: 850 } }
      },
      children: pendingChildren
    }]
  });

  await writeFile(pendingOutputFile, await Packer.toBuffer(pendingDocument));
  console.log("Generado: " + outputFile);
  console.log("Tarjetas puntuables: " + cards.length);
  console.log("Imágenes en el cuestionario puntuable: " + cards.filter((card) => card.image).length);
  console.log("Pendientes generados en companion sin puntuar: " + pendingCards.length);
  console.log("Generado: " + pendingOutputFile);
}

await main();
