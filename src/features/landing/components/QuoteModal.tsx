import type { MachiningService } from "../../../types/domain";
import { QuoteRequestForm } from "./QuoteRequestForm";

export interface QuoteModalProps {
  whatsappNumber: string;
  selectedService?: MachiningService;
  onClose: () => void;
}

export function QuoteModal({
  whatsappNumber,
  selectedService,
  onClose,
}: QuoteModalProps) {
  const modalTitle = selectedService
    ? `Cotizar: ${selectedService.title}`
    : "Nueva Cotización";

  const initialDetails = selectedService
    ? `Servicio requerido: ${selectedService.title}.\nEspecificaciones de la pieza: `
    : "";

  const formKey = selectedService ? `service-${selectedService.id}` : "general";

  return (
    <div className="modal-fondo" onClick={onClose}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-btn-cerrar"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        <h3
          className="titulo-seccion"
          style={{ fontSize: "1.85rem", marginBottom: "0.75rem" }}
        >
          {modalTitle}
        </h3>

        {selectedService?.technicalDetails ? (
          <div className="ficha-tecnica-modal">
            <span className="etiqueta-ficha">Capacidad Técnica</span>
            <p>{selectedService.technicalDetails}</p>
          </div>
        ) : (
          <p
            style={{
              color: "var(--texto-secundario)",
              marginBottom: "1.5rem",
            }}
          >
            Ingrese los datos de su requerimiento en Metal Working JC. Se
            registrará en nuestro sistema y podrá enviarlo directo por WhatsApp.
          </p>
        )}

        <QuoteRequestForm
          key={formKey}
          whatsappNumber={whatsappNumber}
          source={selectedService ? "servicio" : "modal"}
          initialProjectDetails={initialDetails}
          onSuccess={onClose}
        />
      </div>
    </div>
  );
}

