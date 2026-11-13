import { buildGoogleMapsDirectionsUrl, resolveMapQuery } from "../../../lib/googleMaps";
import type { SiteSettings } from "../../../types/domain";
import { LocationMapSection } from "./LocationMapSection";
import { QuoteRequestForm } from "./QuoteRequestForm";

export interface ContactSectionProps {
  settings: SiteSettings;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const fullMapQuery = resolveMapQuery(
    settings.addressLine1,
    settings.addressLine2,
    settings.mapQuery,
  );
  const directionsUrl = buildGoogleMapsDirectionsUrl(fullMapQuery);

  return (
    <section id="contacto" className="seccion-contacto">
      <div className="contenedor">
        <div className="layout-contacto">
          <div className="info-contacto">
            <h2 className="subtitulo-seccion">Contacto</h2>
            <h3 className="titulo-seccion">{settings.contactHeading}</h3>
            <p>{settings.contactDescription}</p>

            <ul className="lista-contacto">
              <li>
                <span className="material-symbols-outlined icono">
                  location_on
                </span>
                <div className="datos">
                  <span className="label">Ubicación Principal</span>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="valor enlace-contacto-directo"
                    title="Abrir ubicación exacta en Google Maps"
                  >
                    {settings.addressLine1}
                    <br />
                    {settings.addressLine2}
                  </a>
                </div>
              </li>
              <li>
                <span className="material-symbols-outlined icono">call</span>
                <div className="datos">
                  <span className="label">Atención Directa / WhatsApp</span>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="valor enlace-contacto-directo"
                  >
                    {settings.phoneDisplay}
                  </a>
                </div>
              </li>
              <li>
                <span className="material-symbols-outlined icono">mail</span>
                <div className="datos">
                  <span className="label">Email Técnico</span>
                  <a
                    href={`mailto:${settings.emailTechnical}`}
                    className="valor enlace-contacto-directo"
                  >
                    {settings.emailTechnical}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="formulario-contenedor">
            <QuoteRequestForm
              whatsappNumber={settings.whatsappNumber}
              source="contacto"
            />
          </div>
        </div>

        <LocationMapSection
          brandTitle={`${settings.brandName} ${settings.brandSubname}`}
          addressLine1={settings.addressLine1}
          addressLine2={settings.addressLine2}
          customMapQuery={settings.mapQuery}
        />
      </div>
    </section>
  );
}
