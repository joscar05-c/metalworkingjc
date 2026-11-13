import heroFallbackImg from "../../../assets/HERO2.jpg";
import type { SiteSettings } from "../../../types/domain";

export interface HeroSectionProps {
  settings: SiteSettings;
  onOpenQuoteModal: () => void;
}

export function HeroSection({ settings, onOpenQuoteModal }: HeroSectionProps) {
  const backgroundUrl = settings.heroImageUrl ?? heroFallbackImg;

  return (
    <header className="hero">
      <div className="hero-fondo">
        <img
          src={backgroundUrl}
          alt="Torno mecánico de precisión funcionando"
          fetchPriority="high"
        />
      </div>

      <div className="hero-contenido">
        <div className="etiqueta-destacada">
          <span className="punto-animado"></span>
          {settings.heroBadge}
        </div>

        <h1 className="titulo-principal">
          {settings.heroTitleStart}{" "}
          <span>{settings.heroTitleHighlight}</span>{" "}
          {settings.heroTitleEnd}
        </h1>

        <p className="descripcion-hero">{settings.heroDescription}</p>

        <div className="botones-hero">
          <button
            type="button"
            className="btn-primario"
            onClick={onOpenQuoteModal}
          >
            Cotizar Proyecto
          </button>
          <a
            href="#galeria"
            className="btn-secundario"
            style={{
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            Ver Portafolio
          </a>
        </div>
      </div>

      <div className="tolerancia-flotante">
        <span className="numero">
          {settings.toleranceValue}
          <span>{settings.toleranceUnit}</span>
        </span>
        <span className="texto">{settings.toleranceLabel}</span>
      </div>
    </header>
  );
}

