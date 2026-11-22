import imageAudit from "../../../content/redes-parcial-3-2026/AUDITORIA_IMAGENES.json";
import { redesParcial3ImageAssets } from "./redesParcial3ImageAssets.js";
import { buildImageVariants } from "./imageViewerUtils.js";

const entriesByDigest = new Map(
  imageAudit.entries.map((entry) => [entry.embeddedImageSha256, entry])
);

export function getQuestionImageVariants(imageDigest, embeddedImage, questionText = "") {
  const entry = entriesByDigest.get(imageDigest);
  const assets = entry ? redesParcial3ImageAssets[entry.id] : null;
  return buildImageVariants({ embeddedImage, entry, assets, questionText });
}
