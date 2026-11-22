"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");

const OUTPUT_DIR = path.resolve(__dirname, "..");
const ASSET_DIR = path.join(OUTPUT_DIR, "assets");
const OUTPUT_JSON = path.join(OUTPUT_DIR, "preguntas-sin-resolver.json");
const CHECKPOINT_JSON = path.join(OUTPUT_DIR, ".checkpoint-extraccion.json");
const SOURCE_URL =
  process.env.JOYACARDS_4K1_SOURCE_URL || "https://cuestionario-redes.vercel.app/";
const SECTION_NAME = "Parcial 4k1 2026";
const EXPECTED_QUESTION_COUNT = 132;

function loadPlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    const moduleDirectory = process.env.JOYACARDS_PLAYWRIGHT_MODULE_DIR;
    if (!moduleDirectory) throw error;
    return require(path.join(moduleDirectory, "playwright"));
  }
}

const { chromium } = loadPlaywright();

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function selectionCount(prompt) {
  const words = {
    uno: 1,
    una: 1,
    un: 1,
    dos: 2,
    tres: 3,
    cuatro: 4,
    cinco: 5,
    seis: 6,
    siete: 7,
    ocho: 8,
    nueve: 9,
    diez: 10
  };
  const match = prompt.match(
    /(?:seleccione|seleccion[aá]|marque|indique)\s+(\d+|uno|una|un|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(?:opciones?|alternativas?)/i
  );

  if (!match) return null;
  return /^\d+$/.test(match[1]) ? Number(match[1]) : words[match[1].toLowerCase()];
}

async function readQuestionSnapshot(page) {
  return page.locator("main").evaluate((mainElement) => {
    const prompt = mainElement.querySelector("h1")?.innerText?.trim() || "";
    const options = [...mainElement.querySelectorAll("button")]
      .map((button) => {
        const numberNode = [...button.children].find((child) =>
          /^\d+$/.test(child.innerText.trim())
        );
        if (!numberNode) return null;
        const optionText = [...button.children]
          .filter((child) => child !== numberNode)
          .map((child) => child.innerText.trim())
          .filter(Boolean)
          .join("\n");
        if (!optionText) return null;
        return {
          sourceLabel: numberNode.innerText.trim(),
          displayedText: button.innerText.trim(),
          text: optionText
        };
      })
      .filter(Boolean);
    const lines = mainElement.innerText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const sourceNotes = [...new Set(lines.filter((line) =>
      line.includes("⚠") ||
      /opciones no son las originales|imagen fue recreada|imagen fue mejorada|imagen fue generada/i.test(line)
    ))];
    const images = [...mainElement.querySelectorAll("img")].map((image) => ({
      alt: image.alt || "",
      src: image.currentSrc || image.src,
      width: image.naturalWidth,
      height: image.naturalHeight
    }));
    const tables = [...mainElement.querySelectorAll("table")].map((table) =>
      [...table.querySelectorAll("tr")].map((row) =>
        [...row.querySelectorAll("th,td")].map((cell) => cell.innerText.trim())
      )
    );
    return { prompt, options, sourceNotes, images, tables };
  });
}

function contentIdForSnapshot(snapshot) {
  return sha256(
    Buffer.from(
      JSON.stringify({
        prompt: snapshot.prompt,
        options: snapshot.options,
        sourceNotes: snapshot.sourceNotes,
        tables: snapshot.tables,
        imageSources: snapshot.images.map((image) => image.src)
      })
    )
  );
}

function verificationKey(prompt, options, sourceNotes, tables, imageSources) {
  return sha256(
    Buffer.from(
      JSON.stringify({
        prompt,
        options: options.map((option) => option.text).sort(),
        sourceNotes,
        tables,
        imageSources
      })
    )
  );
}

function verificationKeyForRecord(question) {
  return verificationKey(
    question.prompt,
    question.options,
    question.sourceNotes,
    question.tables,
    question.images.map((image) => image.originalUrl)
  );
}

function sameOptionOrder(question, snapshot) {
  return JSON.stringify(question.options.map((option) => option.text)) ===
    JSON.stringify(snapshot.options.map((option) => option.text));
}

async function openIndexedQuestion(page, number) {
  const indexLabel = page.getByText(`Pregunta ${number}`, { exact: true });
  const matches = await indexLabel.count();
  if (matches !== 1) {
    throw new Error(
      `La posición ${number} tiene ${matches} etiquetas de índice visibles; se detiene para no navegar a otra tarjeta.`
    );
  }
  await indexLabel.click({ timeout: 15000 });
  await page.waitForFunction(
    ({ current, total }) => {
      const text = document.querySelector("main")?.innerText || "";
      return new RegExp(`Pregunta\\s+${current}\\s*/\\s*${total}`).test(text);
    },
    { current: number, total: EXPECTED_QUESTION_COUNT },
    { timeout: 15000 }
  );
  await page.waitForTimeout(120);
  await page.waitForFunction(
    () => [...document.querySelectorAll("main img")].every((image) => image.complete),
    null,
    { timeout: 8000 }
  ).catch(() => {});
}

async function verifyLiveSource(page, indexRecords, storedQuestions) {
  if (storedQuestions.length !== EXPECTED_QUESTION_COUNT) {
    throw new Error("La validación requiere las 132 preguntas guardadas.");
  }
  const expectedByKey = new Map();
  for (const question of storedQuestions) {
    const key = verificationKeyForRecord(question);
    expectedByKey.set(key, [...(expectedByKey.get(key) || []), question]);
  }
  const expectedIds = new Set(expectedByKey.keys());
  const expectedDuplicateCount = storedQuestions.length - expectedIds.size;
  const indexByNumber = new Map(indexRecords.map((record) => [record.number, record]));
  const liveIds = [];
  const indexTitleMismatches = [];
  const optionOrderVariations = [];

  for (let number = 1; number <= EXPECTED_QUESTION_COUNT; number += 1) {
    await openIndexedQuestion(page, number);
    const snapshot = await readQuestionSnapshot(page);
    const indexText = indexByNumber.get(number)?.indexText || "";
    const indexTitle = indexText.replace(/^Pregunta\s+\d+\s*/, "").trim();
    if (
      indexTitle &&
      !snapshot.prompt.startsWith(indexTitle) &&
      !indexTitle.startsWith(snapshot.prompt)
    ) {
      indexTitleMismatches.push(number);
    }
    const key = verificationKey(
      snapshot.prompt,
      snapshot.options,
      snapshot.sourceNotes,
      snapshot.tables,
      snapshot.images.map((image) => image.src)
    );
    liveIds.push(key);
    const candidates = expectedByKey.get(key) || [];
    const candidate =
      candidates.find((question) => sameOptionOrder(question, snapshot)) || candidates[0];
    if (!candidate) continue;
    if (!sameOptionOrder(candidate, snapshot)) optionOrderVariations.push(number);
  }

  const liveSet = new Set(liveIds);
  const missing = [...expectedIds].filter((id) => !liveSet.has(id));
  const unexpected = [...liveSet].filter((id) => !expectedIds.has(id));
  const duplicateCount = liveIds.length - liveSet.size;
  if (
    missing.length ||
    unexpected.length ||
    duplicateCount !== expectedDuplicateCount ||
    indexTitleMismatches.length
  ) {
    throw new Error(
      `La segunda lectura de la fuente difiere: faltantes=${missing.length}, nuevos=${unexpected.length}, duplicados=${duplicateCount}, títulos de índice distintos=${indexTitleMismatches.length}.`
    );
  }

  return {
    status: "verified",
    checkedAt: new Date().toISOString(),
    questionsCompared: liveIds.length,
    distinctContentCompared: liveSet.size,
    sourceIndexTitlesMatched: liveIds.length,
    alternativeOrderVariations: optionOrderVariations.length,
    alternativeOrderComparedAsUnorderedSet: true,
    randomizedQuestionOrderAllowed: true,
    optionsSelected: false,
    verificationControlsUsed: false
  };
}

function extensionFor(contentType, sourceUrl) {
  const mime = (contentType || "").split(";")[0].trim().toLowerCase();
  const byMime = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/bmp": ".bmp"
  };
  if (byMime[mime]) return byMime[mime];

  try {
    const candidate = path.extname(new URL(sourceUrl).pathname).toLowerCase();
    if (/^\.(?:jpe?g|png|webp|gif|svg|bmp)$/.test(candidate)) return candidate;
  } catch {
    // Fall through to the safe default for inline data URLs.
  }
  return ".bin";
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function writeJsonAtomically(filePath, value) {
  const temporaryPath = `${filePath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(temporaryPath, filePath);
}

async function readJsonIfPresent(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function questionEnvelope(questions, status, metadata) {
  const contentCounts = new Map();
  for (const question of questions) {
    contentCounts.set(
      question.contentId,
      (contentCounts.get(question.contentId) || 0) + 1
    );
  }

  return {
    schemaVersion: 1,
    source: {
      url: SOURCE_URL,
      section: SECTION_NAME,
      title: metadata.pageTitle
    },
    extraction: {
      status,
      expectedQuestionCount: EXPECTED_QUESTION_COUNT,
      extractedQuestionCount: questions.length,
      startedAt: metadata.startedAt,
      updatedAt: new Date().toISOString(),
      method: "Playwright con Chromium; navegación por el índice visible del test.",
      answerDataCaptured: false,
      optionsSelected: false,
      verificationControlsUsed: false,
      distinctContentCount: contentCounts.size,
      duplicateOccurrences: [...contentCounts.values()].reduce(
        (sum, count) => sum + Math.max(count - 1, 0),
        0
      ),
      sourceSectionDescription: metadata.sectionDescription
    },
    questions
  };
}

async function saveImage(context, page, image, questionContentId, index) {
  const sourceUrl = image.src;
  let data = null;
  let contentType = "";
  let sourceKind = "downloaded_original";
  let captureNote = null;

  if (sourceUrl.startsWith("data:")) {
    const match = sourceUrl.match(/^data:([^;,]+)?(;base64)?,(.*)$/s);
    if (match) {
      contentType = match[1] || "application/octet-stream";
      data = match[2]
        ? Buffer.from(match[3], "base64")
        : Buffer.from(decodeURIComponent(match[3]), "utf8");
    }
  } else {
    try {
      const response = await context.request.get(sourceUrl, { timeout: 20000 });
      if (response.ok()) {
        contentType = response.headers()["content-type"] || "";
        data = await response.body();
      }
    } catch {
      // A rendered capture below is the documented fallback for an unavailable download.
    }
  }

  if (!data || !data.length || !contentType.toLowerCase().startsWith("image/")) {
    const visibleImage = page.locator("main img").nth(index);
    const dimensions = await visibleImage
      .evaluate((element) => ({ width: element.naturalWidth, height: element.naturalHeight }))
      .catch(() => ({ width: 0, height: 0 }));

    if (dimensions.width > 0 && dimensions.height > 0) {
      data = await visibleImage.screenshot({ type: "png", timeout: 15000 });
      contentType = "image/png";
      sourceKind = "rendered_capture";
      captureNote =
        "El recurso no pudo guardarse directamente; se conservó una captura del elemento renderizado.";
    }
  }

  if (!data || !data.length) {
    return {
      id: `image-${index + 1}`,
      alt: image.alt,
      originalUrl: sourceUrl.startsWith("data:") ? null : sourceUrl,
      mediaType: contentType || null,
      width: image.width || null,
      height: image.height || null,
      file: null,
      sha256: null,
      sourceKind: "unavailable",
      extractionStatus: "partial",
      note: "No se pudo descargar ni capturar este recurso visible."
    };
  }

  const digest = sha256(data);
  const extension = extensionFor(contentType, sourceUrl);
  const fileName = `image-${digest.slice(0, 24)}${extension}`;
  const absolutePath = path.join(ASSET_DIR, fileName);
  if (!(await exists(absolutePath))) await fs.writeFile(absolutePath, data);

  return {
    id: `image-${digest.slice(0, 16)}`,
    alt: image.alt,
    originalUrl: sourceUrl.startsWith("data:") ? null : sourceUrl,
    mediaType: contentType.split(";")[0] || null,
    width: image.width || null,
    height: image.height || null,
    file: `assets/${fileName}`,
    sha256: digest,
    sourceKind,
    extractionStatus: "complete",
    note: captureNote
  };
}

async function main() {
  await fs.mkdir(ASSET_DIR, { recursive: true });
  const priorCheckpoint = await readJsonIfPresent(CHECKPOINT_JSON);
  const priorOutput = priorCheckpoint || (await readJsonIfPresent(OUTPUT_JSON));
  const contentCache = new Map(
    (priorOutput?.contentCache || priorOutput?.questions || []).map((record) => [
      record.contentId,
      record
    ])
  );
  const startedAt = new Date().toISOString();
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1
    });
    const page = await context.newPage();
    await page.goto(SOURCE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.getByRole("button", { name: SECTION_NAME, exact: true }).click();
    const sectionText = await page.locator("body").innerText();
    const sectionDescription = sectionText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => /132\s+preguntas/i.test(line)) || null;
    const pageTitle = await page.title();
    await page.getByRole("button", { name: "Iniciar test", exact: true }).click();
    await page.locator("main h1").waitFor({ state: "visible", timeout: 20000 });

    const indexRecords = await page.locator("button").evaluateAll((buttons) =>
      buttons.flatMap((button) => {
        const label = [...button.querySelectorAll("span")].find((span) =>
          /^Pregunta\s+\d+$/.test(span.innerText.trim())
        );
        if (!label) return [];
        const number = Number(label.innerText.trim().match(/\d+/)[0]);
        return [{ number, indexText: button.innerText.trim() }];
      })
    );

    const indexNumbers = indexRecords.map((record) => record.number).sort((a, b) => a - b);
    const completeIndex =
      indexNumbers.length === EXPECTED_QUESTION_COUNT &&
      indexNumbers.every((number, index) => number === index + 1);
    if (!completeIndex) {
      throw new Error(
        `El índice visible contiene ${indexNumbers.length} posiciones, no las ${EXPECTED_QUESTION_COUNT} esperadas.`
      );
    }

    if (process.argv.includes("--verify-only")) {
      const stored = await readJsonIfPresent(OUTPUT_JSON);
      if (!stored || stored.extraction.status !== "complete") {
        throw new Error("No hay una extracción completa para cotejar con la fuente.");
      }
      const validation = await verifyLiveSource(page, indexRecords, stored.questions);
      stored.extraction.sourceValidation = validation;
      stored.extraction.updatedAt = new Date().toISOString();
      await writeJsonAtomically(OUTPUT_JSON, stored);
      console.log(
        `Cotejo completo: ${validation.questionsCompared} posiciones, ${validation.distinctContentCompared} contenidos distintos, títulos del índice compatibles.`
      );
      return;
    }

    const questions = [];
    const occurrenceCounts = new Map();
    const metadata = { pageTitle, sectionDescription, startedAt };
    const emptyEnvelope = questionEnvelope(questions, "in_progress", metadata);
    await writeJsonAtomically(OUTPUT_JSON, emptyEnvelope);
    await writeJsonAtomically(CHECKPOINT_JSON, {
      ...emptyEnvelope,
      contentCache: [...contentCache.values()]
    });

    for (let extractionPosition = 1; extractionPosition <= EXPECTED_QUESTION_COUNT; extractionPosition += 1) {
      await openIndexedQuestion(page, extractionPosition);
      const snapshot = await readQuestionSnapshot(page);

      const explicitSelectionCount = selectionCount(snapshot.prompt);
      const responseType =
        explicitSelectionCount !== null && explicitSelectionCount > 1 ? "multiple" : "single";
      const responseTypeBasis =
        explicitSelectionCount !== null
          ? "cantidad indicada literalmente en el enunciado"
          : "el enunciado visible no indica selección múltiple";
      const contentId = contentIdForSnapshot(snapshot);
      const occurrence = (occurrenceCounts.get(contentId) || 0) + 1;
      occurrenceCounts.set(contentId, occurrence);
      const cached = contentCache.get(contentId);
      let images;

      if (
        cached &&
        cached.extractionStatus === "complete" &&
        (await Promise.all(cached.images.map((image) =>
          image.file ? exists(path.join(OUTPUT_DIR, image.file)) : false
        ))).every(Boolean)
      ) {
        images = cached.images;
      } else {
        images = [];
        for (let imageIndex = 0; imageIndex < snapshot.images.length; imageIndex += 1) {
          images.push(
            await saveImage(context, page, snapshot.images[imageIndex], contentId, imageIndex)
          );
        }
      }

      const missingImage = images.some((image) => image.extractionStatus !== "complete");
      const extractionStatus =
        snapshot.prompt && snapshot.options.length >= 2 && !missingImage ? "complete" : "partial";
      const record = {
        id: `q-${contentId}`,
        contentId,
        extractionPosition,
        sourceQuestionNumber: extractionPosition,
        duplicateOccurrence: occurrence,
        prompt: snapshot.prompt,
        options: snapshot.options.map((option, index) => ({
          id: `option-${index + 1}`,
          order: index + 1,
          sourceLabel: option.sourceLabel,
          text: option.text,
          displayedText: option.displayedText
        })),
        responseType,
        responseTypeBasis,
        requiredSelections: explicitSelectionCount,
        tables: snapshot.tables,
        images,
        sourceNotes: snapshot.sourceNotes,
        extractionStatus,
        sourceUrl: page.url()
      };

      questions.push(record);
      contentCache.set(contentId, record);
      const data = questionEnvelope(questions, "in_progress", metadata);
      await writeJsonAtomically(OUTPUT_JSON, data);
      await writeJsonAtomically(CHECKPOINT_JSON, {
        ...data,
        contentCache: [...contentCache.values()]
      });
      console.log(
        `[${extractionPosition}/${EXPECTED_QUESTION_COUNT}] opciones=${record.options.length} imágenes=${record.images.length} estado=${record.extractionStatus} duplicado=${occurrence > 1}`
      );
    }

    const finalData = questionEnvelope(questions, "complete", metadata);
    finalData.extraction.extractedQuestionCount = questions.length;
    await writeJsonAtomically(OUTPUT_JSON, finalData);
    await writeJsonAtomically(CHECKPOINT_JSON, {
      ...finalData,
      contentCache: [...contentCache.values()]
    });
    console.log(
      `Extracción terminada: ${questions.length} posiciones, ${new Set(questions.map((question) => question.contentId)).size} contenidos distintos.`
    );
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(`Extracción detenida sin resolver preguntas: ${error.message}`);
  process.exitCode = 1;
});
