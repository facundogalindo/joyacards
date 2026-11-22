import { useEffect, useRef, useState } from "react";
import {
  clampZoom,
  IMAGE_MAX_ZOOM,
  IMAGE_MIN_ZOOM,
  IMAGE_ZOOM_STEP
} from "../data/imageViewerUtils.js";

function distanceBetween(first, second) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function ImageLightbox({
  variants,
  activeVariantId,
  altText,
  onClose,
  onVariantChange
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dialogRef = useRef(null);
  const zoomRef = useRef(zoom);
  const closeButtonRef = useRef(null);
  const stageRef = useRef(null);
  const openerRef = useRef(null);
  const pointersRef = useRef(new Map());
  const gestureRef = useRef(null);

  const activeVariant =
    variants.find((variant) => variant.id === activeVariantId) || variants[0];

  function changeZoom(nextZoom) {
    const clampedZoom = clampZoom(nextZoom);
    zoomRef.current = clampedZoom;
    setZoom(clampedZoom);
    if (clampedZoom <= 1) setPan({ x: 0, y: 0 });
  }

  function resetZoom() {
    zoomRef.current = 1;
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    openerRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        changeZoom(zoomRef.current + IMAGE_ZOOM_STEP);
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        changeZoom(zoomRef.current - IMAGE_ZOOM_STEP);
        return;
      }

      if (event.key === "0" || event.key.toLowerCase() === "f") {
        event.preventDefault();
        resetZoom();
        return;
      }

      if (
        zoomRef.current > 1 &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        event.preventDefault();
        const delta = 44;
        setPan((currentPan) => ({
          x: currentPan.x + (event.key === "ArrowLeft" ? delta : event.key === "ArrowRight" ? -delta : 0),
          y: currentPan.y + (event.key === "ArrowUp" ? delta : event.key === "ArrowDown" ? -delta : 0)
        }));
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      if (openerRef.current?.isConnected) openerRef.current.focus();
    };
  }, [onClose]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    function onWheel(event) {
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
      changeZoom(zoomRef.current * factor);
    }

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, []);

  function handlePointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target.closest(".image-lightbox-controls")) return;

    event.currentTarget.setPointerCapture?.(event.pointerId);
    const pointers = pointersRef.current;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 2) {
      const [first, second] = Array.from(pointers.values());
      gestureRef.current = {
        type: "pinch",
        startDistance: distanceBetween(first, second),
        startZoom: zoom
      };
      setIsDragging(false);
      return;
    }

    if (zoom > 1) {
      gestureRef.current = {
        type: "pan",
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startPan: pan
      };
      setIsDragging(true);
    }
  }

  function handlePointerMove(event) {
    const pointers = pointersRef.current;
    if (!pointers.has(event.pointerId)) return;

    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const gesture = gestureRef.current;

    if (gesture?.type === "pinch" && pointers.size >= 2) {
      const [first, second] = Array.from(pointers.values());
      const currentDistance = distanceBetween(first, second);
      if (gesture.startDistance > 0) {
        changeZoom(gesture.startZoom * (currentDistance / gesture.startDistance));
      }
      return;
    }

    if (gesture?.type === "pan" && gesture.pointerId === event.pointerId) {
      setPan({
        x: gesture.startPan.x + event.clientX - gesture.startX,
        y: gesture.startPan.y + event.clientY - gesture.startY
      });
    }
  }

  function handlePointerUp(event) {
    pointersRef.current.delete(event.pointerId);
    gestureRef.current = null;
    setIsDragging(false);
  }

  return (
    <div
      className="image-lightbox-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="image-lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Visor de imagen"
        tabIndex={-1}
      >
        <header className="image-lightbox-header">
          <div className="image-lightbox-heading">
            <strong>{activeVariant.label}</strong>
            <span>{altText}</span>
          </div>
          <div className="image-lightbox-controls" aria-label="Controles de imagen">
            <button
              type="button"
              onClick={() => changeZoom(zoom - IMAGE_ZOOM_STEP)}
              disabled={zoom <= IMAGE_MIN_ZOOM}
              aria-label="Alejar imagen"
              title="Alejar"
            >
              −
            </button>
            <output aria-live="polite">{Math.round(zoom * 100)}%</output>
            <button
              type="button"
              onClick={() => changeZoom(zoom + IMAGE_ZOOM_STEP)}
              disabled={zoom >= IMAGE_MAX_ZOOM}
              aria-label="Acercar imagen"
              title="Acercar"
            >
              +
            </button>
            <button type="button" onClick={resetZoom} aria-label="Restablecer zoom">
              Restablecer zoom
            </button>
            <button type="button" onClick={resetZoom} aria-label="Ajustar a pantalla">
              Ajustar a pantalla
            </button>
            <button
              ref={closeButtonRef}
              className="image-lightbox-close"
              type="button"
              onClick={onClose}
              aria-label="Cerrar visor de imagen"
              title="Cerrar"
            >
              ×
            </button>
          </div>
        </header>

        {variants.length > 1 && (
          <div className="image-lightbox-variants" role="group" aria-label="Versiones de la imagen">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                className={variant.id === activeVariant.id ? "active" : ""}
                aria-pressed={variant.id === activeVariant.id}
                onClick={() => onVariantChange(variant.id)}
              >
                {variant.label}
              </button>
            ))}
          </div>
        )}

        <div
          ref={stageRef}
          className={"image-lightbox-stage " + (isDragging ? "is-dragging" : "")}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onLostPointerCapture={handlePointerUp}
          aria-label="Área de imagen; arrastrá para desplazarte cuando haya zoom"
          role="group"
        >
          <img
            className="image-lightbox-image"
            src={activeVariant.src}
            alt={altText + " — " + activeVariant.label}
            draggable="false"
            style={{
              transform: "translate3d(" + pan.x + "px, " + pan.y + "px, 0) scale(" + zoom + ")"
            }}
          />
        </div>

        <p className="image-lightbox-caption">
          Rueda del mouse o gestos para ampliar. Arrastrá la imagen ampliada; usá Escape para cerrar.
        </p>
      </section>
    </div>
  );
}

export default ImageLightbox;
