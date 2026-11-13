import { useState, type FormEvent } from "react";
import type { QuoteRequestSource } from "../../../types/domain";
import { useCreateQuoteMutation } from "../hooks/useCreateQuoteMutation";

export interface QuoteRequestFormProps {
  whatsappNumber: string;
  source: QuoteRequestSource;
  initialProjectDetails?: string;
  onSuccess?: () => void;
}

export function QuoteRequestForm({
  whatsappNumber,
  source,
  initialProjectDetails = "",
  onSuccess,
}: QuoteRequestFormProps) {
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectDetails, setProjectDetails] = useState(initialProjectDetails);
  const [sendViaWhatsapp, setSendViaWhatsapp] = useState(true);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const mutation = useCreateQuoteMutation(whatsappNumber);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!clientName.trim() || !projectDetails.trim()) {
      return;
    }

    mutation.mutate(
      {
        clientName,
        companyName: companyName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        projectDetails,
        source,
        sendViaWhatsapp,
      },
      {
        onSuccess: () => {
          setSubmittedSuccess(true);
          setClientName("");
          setCompanyName("");
          setEmail("");
          setPhone("");
          setProjectDetails("");
          if (onSuccess) {
            setTimeout(() => {
              onSuccess();
            }, 1400);
          }
        },
      },
    );
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <div className="fila-form">
        <div className="grupo-form">
          <label htmlFor={`nombre-${source}`}>Nombre Completo *</label>
          <input
            type="text"
            id={`nombre-${source}`}
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Ej. Juan Pérez"
          />
        </div>
        <div className="grupo-form">
          <label htmlFor={`empresa-${source}`}>Empresa</label>
          <input
            type="text"
            id={`empresa-${source}`}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Industrial S.A.C."
          />
        </div>
      </div>

      <div className="fila-form">
        <div className="grupo-form">
          <label htmlFor={`email-${source}`}>Correo Electrónico</label>
          <input
            type="email"
            id={`email-${source}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juan@empresa.com"
          />
        </div>
        <div className="grupo-form">
          <label htmlFor={`telefono-${source}`}>Teléfono / WhatsApp</label>
          <input
            type="text"
            id={`telefono-${source}`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+51 999 888 777"
          />
        </div>
      </div>

      <div className="grupo-form">
        <label htmlFor={`detalles-${source}`}>Detalles del Proyecto *</label>
        <textarea
          id={`detalles-${source}`}
          rows={4}
          required
          value={projectDetails}
          onChange={(e) => setProjectDetails(e.target.value)}
          placeholder="Describa la pieza, material, cantidad y tolerancias requeridas..."
        />
      </div>

      <label className="checkbox-whatsapp">
        <input
          type="checkbox"
          checked={sendViaWhatsapp}
          onChange={(e) => setSendViaWhatsapp(e.target.checked)}
        />
        <span>
          Enviar también directamente al WhatsApp técnico (+{whatsappNumber})
        </span>
      </label>

      {submittedSuccess && (
        <div className="alerta-exito-form" role="status">
          <span className="material-symbols-outlined">check_circle</span>
          <span>
            ¡Solicitud registrada! Nuestro equipo técnico responderá a la
            brevedad.
          </span>
        </div>
      )}

      {mutation.isError && (
        <div className="alerta-error-form" role="alert">
          No se pudo enviar la solicitud. Inténtelo nuevamente.
        </div>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="btn-primario ancho-completo"
      >
        {mutation.isPending ? "Procesando..." : "Enviar Solicitud"}
        <span className="material-symbols-outlined">send</span>
      </button>
    </form>
  );
}

