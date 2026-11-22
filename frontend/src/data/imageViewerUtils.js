const IMAGE_DIGEST_CACHE_LIMIT = 80;

const imageDigestCache = new Map();

export const IMAGE_MIN_ZOOM = 0.65;
export const IMAGE_MAX_ZOOM = 6;
export const IMAGE_ZOOM_STEP = 0.25;

export function clampZoom(value) {
  return Math.min(IMAGE_MAX_ZOOM, Math.max(IMAGE_MIN_ZOOM, value));
}

export async function computeImageDigest(dataUrl) {
  if (!dataUrl) throw new Error("No hay datos de imagen para calcular la huella.");
  if (imageDigestCache.has(dataUrl)) return imageDigestCache.get(dataUrl);

  const digestPromise = (async () => {
    const match = dataUrl.match(/^data:[^,]*;base64,([\s\S]+)$/);
    if (!match) throw new Error("Formato de imagen no compatible con el catálogo.");

    const binary = globalThis.atob(match[1]);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
  })();

  imageDigestCache.set(dataUrl, digestPromise);
  if (imageDigestCache.size > IMAGE_DIGEST_CACHE_LIMIT) {
    imageDigestCache.delete(imageDigestCache.keys().next().value);
  }

  return digestPromise;
}

export function buildImageVariants({ embeddedImage, entry, assets }) {
  if (!entry || !assets?.original) {
    return [{
      id: "original",
      label: "Imagen original",
      src: embeddedImage,
      kind: "original"
    }];
  }

  const variants = [
    {
      id: "original",
      label: "Fotografía original",
      src: assets.original,
      kind: "original"
    },
    {
      id: "detail",
      label: "Recorte original ampliado",
      src: embeddedImage,
      kind: "detail"
    }
  ];

  if (entry.enhancedImageFile && assets.enhanced) {
    variants.push({
      id: "enhanced",
      label: "Versión mejorada",
      src: assets.enhanced,
      kind: "enhanced"
    });
  }

  if (
    entry.reconstructionStatus === "APROBADA" &&
    entry.reconstructionFile &&
    assets.reconstruction
  ) {
    variants.push({
      id: "reconstruction",
      label: "Reconstrucción visual para práctica",
      src: assets.reconstruction,
      kind: "reconstruction"
    });
  }

  return variants;
}