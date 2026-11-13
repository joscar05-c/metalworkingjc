import type { GalleryItem } from "../../../types/domain";

export interface GalleryLightboxModalProps {
  items: GalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onSelectIndex: (nextIndex: number) => void;
  onQuoteSimilar: (item: GalleryItem) => void;
}

export function GalleryLightboxModal({
  items,
  activeIndex,
  onClose,
  onSelectIndex,
  onQuoteSimilar,
}: GalleryLightboxModalProps) {
  const currentItem = items[activeIndex];
  if (!currentItem) return null;

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + items.length) % items.length;
    onSelectIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % items.length;
    onSelectIndex(nextIdx);
  };

  return (
    <div className="modal-fondo lightbox-fondo" onClick={onClose}>
      <div
        className="lightbox-contenedor"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-btn-cerrar"
          onClick={onClose}
          aria-label="Cerrar visor"
        >
          &times;
        </button>

        <div className="lightbox-imagen-wrapper">
          {items.length > 1 && (
            <button
              type="button"
              className="lightbox-nav-btn lightbox-prev"
              onClick={handlePrev}
              aria-label="Imagen anterior"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          )}

          <img
            src={currentItem.imageUrl}
            alt={currentItem.title}
            className="lightbox-img"
          />

          {items.length > 1 && (
            <button
              type="button"
              className="lightbox-nav-btn lightbox-next"
              onClick={handleNext}
              aria-label="Imagen siguiente"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )}
        </div>

        <div className="lightbox-footer">
          <div>
            {currentItem.badgeText && (
              <span className="lightbox-badge">{currentItem.badgeText}</span>
            )}
            <h4>{currentItem.title}</h4>
            <span className="admin-meta-texto">
              Pieza {activeIndex + 1} de {items.length}
            </span>
          </div>

          <button
            type="button"
            className="btn-primario btn-sm"
            onClick={() => onQuoteSimilar(currentItem)}
          >
            <span className="material-symbols-outlined">
              precision_manufacturing
            </span>
            Cotizar Pieza Similar
          </button>
        </div>
      </div>
    </div>
  );
}

