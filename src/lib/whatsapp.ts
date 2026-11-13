import type { CreateQuoteInput } from "../types/domain";

export function buildWhatsappQuoteUrl(
  whatsappNumber: string,
  quote: CreateQuoteInput,
): string {
  const digitsOnly = whatsappNumber.replace(/\D/g, "");
  const targetPhone = digitsOnly.length > 0 ? digitsOnly : "51927885314";

  const lines: string[] = [
    "Hola *Metal Working JC*, deseo solicitar una cotización:",
    "",
    `• *Cliente:* ${quote.clientName}`,
  ];

  if (quote.companyName) {
    lines.push(`• *Empresa:* ${quote.companyName}`);
  }
  if (quote.phone) {
    lines.push(`• *Teléfono:* ${quote.phone}`);
  }
  if (quote.email) {
    lines.push(`• *Correo:* ${quote.email}`);
  }

  lines.push("");
  lines.push("*Requerimiento Técnico:*");
  lines.push(quote.projectDetails);

  const encodedMessage = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${targetPhone}?text=${encodedMessage}`;
}

