import type { GalleryItem } from "../../../types/domain";

export interface GallerySectionProps {
  items: GalleryItem[];
}

export function GallerySection({ items }: GallerySectionProps) {
  return (
    <section id="galeria" className="seccion-galeria">
      <div className="contenedor">
        <div className="cabecera-seccion">
          <div>
            <h2 className="subtitulo-seccion">Muestra de Trabajo</h2>
            <h3 className="titulo-seccion">Galería de Precisión</h3>
          </div>
        </div>

        <div className="galeria-grid">
          {items.map((item) => {
            const spanClass =
              item.gridSpan === "normal"
                ? "item-galeria"
                : `item-galeria ${item.gridSpan}`;

            return (
              <div key={item.id} className={spanClass}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                />
                {item.badgeText && (
                  <div className="etiqueta-imagen">{item.badgeText}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

