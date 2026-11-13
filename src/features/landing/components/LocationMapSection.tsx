import { useState } from "react";
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsEmbedUrl,
  resolveMapQuery,
  type GoogleMapType,
} from "../../../lib/googleMaps";

export interface LocationMapSectionProps {
  brandTitle: string;
  addressLine1: string;
  addressLine2: string;
  customMapQuery?: string;
}

export function LocationMapSection({
  brandTitle,
  addressLine1,
  addressLine2,
  customMapQuery,
}: LocationMapSectionProps) {
  const [mapType, setMapType] = useState<GoogleMapType>("roadmap");

  const resolvedQuery = resolveMapQuery(
    addressLine1,
    addressLine2,
    customMapQuery,
  );
  const embedUrl = buildGoogleMapsEmbedUrl(resolvedQuery, mapType);
  const directionsUrl = buildGoogleMapsDirectionsUrl(resolvedQuery);

  return (
    <div id="mapa-taller" className="mapa-taller-contenedor">
      <div className="mapa-taller-header">
        <div className="mapa-taller-titulo">
          <span className="material-symbols-outlined mapa-taller-pin">
            location_on
          </span>
          <div>
            <span className="mapa-taller-etiqueta">
              Ubicación Exacta del Taller
            </span>
            <p className="mapa-taller-direccion">
              {addressLine1} — {addressLine2}
            </p>
          </div>
        </div>

        <div className="mapa-taller-acciones">
          <div className="mapa-tipo-switch" role="group" aria-label="Tipo de mapa">
            <button
              type="button"
              className={
                mapType === "roadmap"
                  ? "btn-mapa-tipo activo"
                  : "btn-mapa-tipo"
              }
              onClick={() => setMapType("roadmap")}
            >
              Mapa
            </button>
            <button
              type="button"
              className={
                mapType === "satellite"
                  ? "btn-mapa-tipo activo"
                  : "btn-mapa-tipo"
              }
              onClick={() => setMapType("satellite")}
            >
              Satélite
            </button>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primario btn-sm"
          >
            <span className="material-symbols-outlined">directions</span>
            Cómo llegar
          </a>
        </div>
      </div>

      <div className="mapa-taller-frame-wrapper">
        <iframe
          title={`Mapa de ubicación de ${brandTitle}`}
          src={embedUrl}
          className="mapa-taller-iframe"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

