import { Link } from "react-router";

export interface NavbarSectionProps {
  brandName: string;
  brandSubname: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenQuoteModal: () => void;
}

export function NavbarSection({
  brandName,
  brandSubname,
  isDarkMode,
  onToggleTheme,
  onOpenQuoteModal,
}: NavbarSectionProps) {
  const logoClassName = isDarkMode ? "img-logo logo-blanco" : "img-logo";
  const themeIcon = isDarkMode ? "light_mode" : "dark_mode";

  return (
    <nav className="barra-navegacion">
      <div className="contenedor-nav">
        <a href="#" className="logo-grupo" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="logo-icono">
            <img
              src="/logo-oscuro.png"
              alt={`Logo ${brandName} ${brandSubname}`}
              className={logoClassName}
            />
          </div>
          <div className="logo-texto">
            <span className="marca">{brandName}</span>
            <span className="submarca">{brandSubname}</span>
          </div>
        </a>

        <ul className="enlaces-nav">
          <li>
            <a href="#servicios">Servicios</a>
          </li>
          <li>
            <a href="#experiencia">Experiencia</a>
          </li>
          <li>
            <a href="#galeria">Galería</a>
          </li>
          <li>
            <a href="#contacto">Contacto</a>
          </li>
        </ul>

        <div className="nav-botones">
          <Link
            to="/admin"
            className="btn-secundario btn-admin-acceso"
            title="Administrar contenido del sitio"
          >
            <span className="material-symbols-outlined">tune</span>
            <span className="texto-btn-admin">Admin</span>
          </Link>

          <button
            type="button"
            onClick={onToggleTheme}
            className="btn-secundario btn-redondo"
            aria-label="Cambiar tema visual"
          >
            <span className="material-symbols-outlined">{themeIcon}</span>
          </button>

          <button
            type="button"
            onClick={onOpenQuoteModal}
            className="btn-primario"
          >
            Cotizar Proyecto
          </button>
        </div>
      </div>
    </nav>
  );
}

