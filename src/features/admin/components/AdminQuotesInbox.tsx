import { useState, useTransition } from "react";
import type { QuoteRequest, QuoteRequestStatus } from "../../../types/domain";

export interface AdminQuotesInboxProps {
  quotes: QuoteRequest[];
  onUpdateStatus: (
    id: number,
    status: QuoteRequestStatus,
    adminNotes?: string,
  ) => void;
  onDeleteQuote: (id: number) => void;
}

const STATUS_LABELS: Record<QuoteRequestStatus, string> = {
  pendiente: "Pendiente",
  en_revision: "En Revisión",
  cotizado: "Cotizado",
  archivado: "Archivado",
};

function isQuoteStatus(value: string): value is QuoteRequestStatus {
  return (
    value === "pendiente" ||
    value === "en_revision" ||
    value === "cotizado" ||
    value === "archivado"
  );
}

export function AdminQuotesInbox({
  quotes,
  onUpdateStatus,
  onDeleteQuote,
}: AdminQuotesInboxProps) {
  const [filterStatus, setFilterStatus] = useState<QuoteRequestStatus | "all">(
    "all",
  );
  const [isPendingTransition, startTransition] = useTransition();

  const handleSelectFilter = (nextFilter: QuoteRequestStatus | "all") => {
    // Regla `rerender-transitions`: usar startTransition en filtros no urgentes
    startTransition(() => {
      setFilterStatus(nextFilter);
    });
  };

  const filteredQuotes =
    filterStatus === "all"
      ? quotes
      : quotes.filter((item) => item.status === filterStatus);

  return (
    <div className="admin-seccion-stack">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Bandeja de Solicitudes de Cotización ({quotes.length})</h3>
            <p>
              Gestiona los pedidos recibidos desde el formulario de Contacto y
              el Modal de Cotización.
            </p>
          </div>

          <div className="admin-filtros-barra">
            <button
              type="button"
              className={
                filterStatus === "all"
                  ? "btn-primario btn-sm"
                  : "btn-secundario btn-sm"
              }
              onClick={() => handleSelectFilter("all")}
            >
              Todas ({quotes.length})
            </button>
            {(
              ["pendiente", "en_revision", "cotizado", "archivado"] as const
            ).map((statusKey) => (
              <button
                key={statusKey}
                type="button"
                className={
                  filterStatus === statusKey
                    ? "btn-primario btn-sm"
                    : "btn-secundario btn-sm"
                }
                onClick={() => handleSelectFilter(statusKey)}
              >
                {STATUS_LABELS[statusKey]}
              </button>
            ))}
          </div>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="admin-vacio">
            No hay solicitudes en este estado actualmente.
          </div>
        ) : (
          <div
            className="admin-lista-cotizaciones"
            style={{ opacity: isPendingTransition ? 0.65 : 1 }}
          >
            {filteredQuotes.map((quote) => {
              const cleanClientPhone = quote.phone?.replace(/\D/g, "");
              const whatsappReplyUrl = cleanClientPhone
                ? `https://wa.me/${cleanClientPhone}?text=${encodeURIComponent(
                    `Hola ${quote.clientName}, le saludamos del área técnica de Metal Working JC respecto a su solicitud de cotización: "${quote.projectDetails.slice(0, 80)}..."`,
                  )}`
                : undefined;

              return (
                <article
                  key={quote.id}
                  className="admin-cotizacion-item"
                >
                  <div className="admin-cotizacion-top">
                    <div>
                      <h4>
                        {quote.clientName}{" "}
                        {quote.companyName && (
                          <span className="admin-empresa-tag">
                            ({quote.companyName})
                          </span>
                        )}
                      </h4>
                      <span className="admin-meta-texto">
                        Origen: {quote.source.toUpperCase()} • Recibido:{" "}
                        {new Date(quote.createdAt).toLocaleString("es-PE")}
                      </span>
                    </div>

                    <div className="admin-botones-grupo">
                      <select
                        className="select-industrial"
                        value={quote.status}
                        onChange={(e) => {
                          if (isQuoteStatus(e.target.value)) {
                            onUpdateStatus(
                              quote.id,
                              e.target.value,
                              quote.adminNotes,
                            );
                          }
                        }}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_revision">En Revisión</option>
                        <option value="cotizado">Cotizado</option>
                        <option value="archivado">Archivado</option>
                      </select>

                      <button
                        type="button"
                        className="btn-secundario btn-sm btn-peligro"
                        onClick={() => onDeleteQuote(quote.id)}
                        title="Eliminar solicitud"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>

                  <p className="admin-cotizacion-detalle">
                    {quote.projectDetails}
                  </p>

                  <div className="admin-cotizacion-contacto">
                    {quote.email && (
                      <a
                        href={`mailto:${quote.email}`}
                        className="btn-secundario btn-sm"
                      >
                        <span className="material-symbols-outlined">mail</span>
                        {quote.email}
                      </a>
                    )}
                    {whatsappReplyUrl && (
                      <a
                        href={whatsappReplyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primario btn-sm"
                      >
                        <span className="material-symbols-outlined">chat</span>
                        Responder a {quote.phone}
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

