import { useState } from "react";
import type { GalleryItem } from "../../../types/domain";
import { GalleryLightboxModal } from "./GalleryLightboxModal";

export interface GallerySectionProps {
  items: GalleryItem[];
  onQuoteGalleryItem: (item: GalleryItem) => void;
}

export function GallerySection({
  items,
  onQuoteGalleryItem,
}: GallerySectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  return (
    <section id="galeria" className="seccion-galeria">
      <div className="contenedor">
        <div className="cabecera-seccion">
          <div>
            <h2 className="subtitulo-seccion">Muestra de Trabajo</h2>
            <h3 className="titulo-seccion">Galería de Precisión</h3>
          </div>
          <p className="texto-apoyo">
            Haz clic en cualquier pieza para inspeccionarla en pantalla completa.
          </p>
        </div>

        <div className="galeria-grid">
          {items.map((item, index) => {
            const spanClass =
              item.gridSpan === "normal"
                ? "item-galeria"
                : `item-galeria ${item.gridSpan}`;

            return (
              <div
                key={item.id}
                className={spanClass}
                onClick={() => setActiveIndex(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIndex(index);
                  }
                }}
              >
                <img src={item.imageUrl} alt={item.title} loading="lazy" />
                <div className="etiqueta-imagen">
                  {item.badgeText ?? item.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeIndex !== undefined && (
        <GalleryLightboxModal
          items={items}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(undefined)}
          onSelectIndex={setActiveIndex}
          onQuoteSimilar={(item) => {
            setActiveIndex(undefined);
            onQuoteGalleryItem(item);
          }}
        />
      )}
    </section>
  );
}
