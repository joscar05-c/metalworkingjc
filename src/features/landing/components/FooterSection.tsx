import { Link } from "react-router";
import type { SiteSettings } from "../../../types/domain";

export interface FooterSectionProps {
  settings: SiteSettings;
  isDarkMode: boolean;
}

export function FooterSection({ settings, isDarkMode }: FooterSectionProps) {
  const logoClassName = isDarkMode ? "img-logo logo-blanco" : "img-logo";

  return (
    <footer className="pie-pagina">
      <div className="contenedor layout-footer">
        <div className="logo-grupo">
          <div className="logo-icono">
            <img
              src="/logo-oscuro.png"
              alt={`Logo ${settings.brandName}`}
              className={logoClassName}
            />
          </div>
          <div className="logo-texto">
            <span className="marca">{settings.brandName}</span>
            <span className="submarca">{settings.brandSubname}</span>
          </div>
        </div>

        <p className="copyright">{settings.copyrightText}</p>

        <div className="redes">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp Técnico"
          >
            <span className="material-symbols-outlined">chat</span>
          </a>
          <a href={`mailto:${settings.emailTechnical}`} title="Correo Técnico">
            <span className="material-symbols-outlined">mail</span>
          </a>
          <Link to="/admin" title="Panel de Administración">
            <span className="material-symbols-outlined">
              admin_panel_settings
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

