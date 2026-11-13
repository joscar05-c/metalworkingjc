import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsEmbedUrl,
  resolveMapQuery,
} from "../../../lib/googleMaps";

export interface AdminMapPreviewProps {
  addressLine1: string;
  addressLine2: string;
  customMapQuery?: string;
}

export function AdminMapPreview({
  addressLine1,
  addressLine2,
  customMapQuery,
}: AdminMapPreviewProps) {
  const query = resolveMapQuery(addressLine1, addressLine2, customMapQuery);
  const embedUrl = buildGoogleMapsEmbedUrl(query, "roadmap");
  const directionsUrl = buildGoogleMapsDirectionsUrl(query);

  return (
    <div className="admin-mapa-preview">
      <div className="admin-mapa-preview-header">
        <div>
          <span className="admin-meta-texto">
            Vista previa del pin en Google Maps: <strong>{query}</strong>
          </span>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secundario btn-sm"
        >
          <span className="material-symbols-outlined">open_in_new</span>
          Abrir en Google Maps
        </a>
      </div>

      <iframe
        title="Vista previa de ubicación en Google Maps"
        src={embedUrl}
        className="admin-mapa-preview-iframe"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

