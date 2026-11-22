import test from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";

import {
  buildImageVariants,
  clampZoom,
  computeImageDigest,
  IMAGE_MAX_ZOOM,
  IMAGE_MIN_ZOOM
} from "../src/data/imageViewerUtils.js";

test("image data URLs are hashed from their original bytes", async () => {
  const bytes = Buffer.from("viewer digest fixture");
  const source = "data:image/jpeg;base64," + bytes.toString("base64");
  const expected = createHash("sha256").update(bytes).digest("hex");

  assert.equal(await computeImageDigest(source), expected);
  assert.equal(await computeImageDigest(source), expected);
});

test("zoom stays within the supported limits", () => {
  assert.equal(clampZoom(0.1), IMAGE_MIN_ZOOM);
  assert.equal(clampZoom(1.25), 1.25);
  assert.equal(clampZoom(20), IMAGE_MAX_ZOOM);
});

test("catalog variants preserve the original, detail, enhancement, and approved reconstruction", () => {
  const variants = buildImageVariants({
    embeddedImage: "data:image/jpeg;base64,detail",
    entry: {
      enhancedImageFile: "assets/enhanced.jpg",
      reconstructionFile: "assets/reconstruction.svg",
      reconstructionStatus: "APROBADA"
    },
    assets: {
      original: "/full-photo.jpg",
      enhanced: "/enhanced.jpg",
      reconstruction: "/reconstruction.svg"
    }
  });

  assert.deepEqual(variants.map((variant) => variant.id), [
    "original",
    "detail",
    "enhanced",
    "reconstruction"
  ]);
  assert.equal(variants[0].src, "/full-photo.jpg");
  assert.equal(variants[1].src, "data:image/jpeg;base64,detail");
  assert.equal(variants[3].label, "Reconstrucción visual para práctica");
});

test("partial and non-reconstructable entries never expose a reconstruction", () => {
  for (const reconstructionStatus of ["PARCIAL", "NO RECONSTRUIBLE"]) {
    const variants = buildImageVariants({
      embeddedImage: "data:image/jpeg;base64,detail",
      entry: {
        enhancedImageFile: null,
        reconstructionFile: "assets/unapproved.svg",
        reconstructionStatus
      },
      assets: {
        original: "/full-photo.jpg",
        enhanced: null,
        reconstruction: "/unapproved.svg"
      }
    });

    assert.deepEqual(variants.map((variant) => variant.id), [
      "original",
      "detail"
    ]);
  }
});

test("unknown images keep working as a single original image", () => {
  assert.deepEqual(
    buildImageVariants({
      embeddedImage: "data:image/png;base64,unknown",
      entry: null,
      assets: null
    }),
    [{
      id: "original",
      label: "Imagen original",
      src: "data:image/png;base64,unknown",
      kind: "original"
    }]
  );
});