export interface FloatingWhatsappButtonProps {
  whatsappNumber: string;
  brandName: string;
}

export function FloatingWhatsappButton({
  whatsappNumber,
  brandName,
}: FloatingWhatsappButtonProps) {
  const digitsOnly = whatsappNumber.replace(/\D/g, "") || "51927885314";
  const text = encodeURIComponent(
    `Hola *${brandName}*, deseo consultar por un trabajo de torno mecánico / mecanizado de precisión.`,
  );
  const href = `https://wa.me/${digitsOnly}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-flotante"
      aria-label="Atención directa por WhatsApp"
    >
      <span className="whatsapp-flotante-etiqueta">Atención Técnica</span>
      <div className="whatsapp-flotante-icono">
        <span className="material-symbols-outlined">chat</span>
      </div>
    </a>
  );
}

