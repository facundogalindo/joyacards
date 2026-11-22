import { useCallback, useEffect, useMemo, useState } from "react";
import ImageLightbox from "./ImageLightbox.jsx";
import { getQuestionImageVariants } from "../data/redesParcial3ImageCatalog.js";
import { computeImageDigest } from "../data/imageViewerUtils.js";

function QuestionImageViewer({ image, altText, questionKey }) {
  const fallbackVariants = useMemo(() => [{
    id: "original",
    label: "Imagen original",
    src: image,
    kind: "original"
  }], [image]);
  const [variants, setVariants] = useState(fallbackVariants);
  const [activeVariantId, setActiveVariantId] = useState("original");
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    computeImageDigest(image)
      .then((digest) => {
        const nextVariants = getQuestionImageVariants(digest, image);
        if (isCurrent) setVariants(nextVariants);
      })
      .catch(() => {
        if (isCurrent) setVariants(fallbackVariants);
      });

    return () => {
      isCurrent = false;
    };
  }, [image, fallbackVariants]);

  const activeVariant =
    variants.find((variant) => variant.id === activeVariantId) || variants[0];
  const closeViewer = useCallback(() => setIsViewerOpen(false), []);
  const changeVariant = useCallback((variantId) => {
    setActiveVariantId(variantId);
  }, []);

  return (
    <figure className="question-image-viewer">
      <button
        className="question-image-open-button"
        type="button"
        onClick={() => setIsViewerOpen(true)}
        aria-label={"Abrir imagen en pantalla completa: " + activeVariant.label}
      >
        <img
          src={activeVariant.src}
          alt={altText + " — " + activeVariant.label}
          className="question-image"
        />
      </button>
      <figcaption className="question-image-caption" aria-live="polite">
        {activeVariant.label}
      </figcaption>
      <div className="question-image-actions" role="group" aria-label="Opciones de visualización de imagen">
        {variants
          .filter((variant) => variant.id !== activeVariant.id)
          .map((variant) => (
            <button
              key={variant.id}
              className="image-variant-button"
              type="button"
              onClick={() => setActiveVariantId(variant.id)}
            >
              {variant.id === "reconstruction"
                ? "Ver reconstrucción"
                : variant.id === "original"
                  ? "Ver fotografía original"
                  : variant.id === "enhanced"
                    ? "Ver versión mejorada"
                    : variant.label}
            </button>
          ))}
        <button
          className="image-fullscreen-button"
          type="button"
          onClick={() => setIsViewerOpen(true)}
        >
          Ver en pantalla completa
        </button>
      </div>

      {isViewerOpen && (
        <ImageLightbox
          key={questionKey}
          variants={variants}
          activeVariantId={activeVariant.id}
          altText={altText}
          onClose={closeViewer}
          onVariantChange={changeVariant}
        />
      )}
    </figure>
  );
}

export default QuestionImageViewer;
