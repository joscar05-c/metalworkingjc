import { useState } from "react";
import type { QuoteRequest, SiteSettings } from "../../../types/domain";

export interface QuoteLineItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface AdminQuotePdfModalProps {
  quote: QuoteRequest;
  settings: SiteSettings;
  onClose: () => void;
}

export function AdminQuotePdfModal({
  quote,
  settings,
  onClose,
}: AdminQuotePdfModalProps) {
  const [deliveryDays, setDeliveryDays] = useState("5 días hábiles");
  const [validityDays, setValidityDays] = useState("15 días");
  const [paymentTerms, setPaymentTerms] = useState(
    "50% adelanto a la orden, 50% contra entrega",
  );
  const [includeIgv, setIncludeIgv] = useState(true);
  const [items, setItems] = useState<QuoteLineItem[]>([
    {
      id: 1,
      description: quote.projectDetails,
      quantity: 1,
      unitPrice: 250,
    },
  ]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const igv = includeIgv ? subtotal * 0.18 : 0;
  const total = subtotal + igv;

  const handleAddLine = () => {
    const nextId =
      items.reduce((max, entry) => Math.max(max, entry.id), 0) + 1;
    setItems((prev) => [
      ...prev,
      {
        id: nextId,
        description: "Servicio de mecanizado adicional",
        quantity: 1,
        unitPrice: 100,
      },
    ]);
  };

  const handleUpdateLine = (
    id: number,
    patch: Partial<Omit<QuoteLineItem, "id">>,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const handleRemoveLine = (id: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePrintPdf = () => {
    const printWindow = window.open("", "_blank", "width=900,height=750");
    if (!printWindow) return;

    const rowsHtml = items
      .map(
        (item, idx) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:center;">${idx + 1}</td>
          <td style="padding:10px;border-bottom:1px solid #ddd;">${item.description}</td>
          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:center;">${item.quantity}</td>
          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:right;">S/ ${item.unitPrice.toFixed(2)}</td>
          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:right;font-weight:bold;">S/ ${(item.quantity * item.unitPrice).toFixed(2)}</td>
        </tr>`,
      )
      .join("");

    const quoteCode = `COT-${new Date().getFullYear()}-${String(quote.id).padStart(4, "0")}`;

    printWindow.document.write(`
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Proforma ${quoteCode} - ${settings.brandName} ${settings.brandSubname}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #1a120b; margin: 32px; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #f27f0d; padding-bottom: 16px; margin-bottom: 24px; }
          .brand { font-size: 24px; font-weight: bold; text-transform: uppercase; }
          .brand span { color: #f27f0d; }
          .badge { background: #1a120b; color: #fff; padding: 6px 14px; font-weight: bold; font-size: 14px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; background: #f8f7f5; padding: 16px; border-left: 4px solid #f27f0d; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { background: #1a120b; color: #fff; padding: 10px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
          .totals { margin-left: auto; width: 280px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; }
          .totals-final { border-top: 2px solid #f27f0d; font-size: 18px; font-weight: bold; padding-top: 10px; margin-top: 6px; }
          .terms { margin-top: 30px; font-size: 13px; border-top: 1px solid #ddd; padding-top: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">${settings.brandName} <span>${settings.brandSubname}</span></div>
            <div>${settings.heroBadge}</div>
            <div style="font-size:13px;color:#555;">${settings.addressLine1} - ${settings.addressLine2}</div>
            <div style="font-size:13px;color:#555;">Tel: ${settings.phoneDisplay} | Email: ${settings.emailTechnical}</div>
          </div>
          <div style="text-align:right;">
            <div class="badge">PROFORMA TÉCNICA: ${quoteCode}</div>
            <div style="font-size:13px;margin-top:6px;">Fecha: ${new Date().toLocaleDateString("es-PE")}</div>
          </div>
        </div>

        <div class="grid">
          <div>
            <strong>CLIENTE / SOLICITANTE:</strong><br/>
            ${quote.clientName}<br/>
            ${quote.companyName ? `Empresa: ${quote.companyName}<br/>` : ""}
            ${quote.phone ? `Teléfono: ${quote.phone}<br/>` : ""}
            ${quote.email ? `Correo: ${quote.email}` : ""}
          </div>
          <div>
            <strong>CONDICIONES COMERCIALES:</strong><br/>
            Tiempo de entrega: ${deliveryDays}<br/>
            Validez de oferta: ${validityDays}<br/>
            Forma de pago: ${paymentTerms}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width:50px;">Ítem</th>
              <th style="text-align:left;">Descripción Técnica del Servicio / Pieza</th>
              <th style="width:80px;">Cant.</th>
              <th style="width:120px;text-align:right;">P. Unitario</th>
              <th style="width:120px;text-align:right;">Importe</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>S/ ${subtotal.toFixed(2)}</span>
          </div>
          ${
            includeIgv
              ? `<div class="totals-row">
                  <span>IGV (18%):</span>
                  <span>S/ ${igv.toFixed(2)}</span>
                </div>`
              : ""
          }
          <div class="totals-row totals-final">
            <span>TOTAL:</span>
            <span>S/ ${total.toFixed(2)}</span>
          </div>
        </div>

        <div class="terms">
          <strong>Garantía de Precisión:</strong> Todas las piezas son verificadas dimensionalmente con tolerancia de hasta ${settings.toleranceValue}${settings.toleranceUnit}.
        </div>

        <script>
          window.onload = () => { window.print(); };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="modal-fondo" onClick={onClose}>
      <div
        className="modal-contenido modal-proforma-ancho"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-btn-cerrar"
          onClick={onClose}
          aria-label="Cerrar generador de PDF"
        >
          &times;
        </button>

        <h3 className="titulo-seccion" style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>
          Generador de Proforma en PDF
        </h3>
        <p style={{ color: "var(--texto-secundario)", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
          Cliente: <strong>{quote.clientName}</strong>{" "}
          {quote.companyName ? `(${quote.companyName})` : ""}
        </p>

        <div className="formulario">
          <div className="fila-form fila-tres-columnas">
            <div className="grupo-form">
              <label>Tiempo de Entrega</label>
              <input
                type="text"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
              />
            </div>
            <div className="grupo-form">
              <label>Validez de Oferta</label>
              <input
                type="text"
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
              />
            </div>
            <div className="grupo-form">
              <label>Condición de Pago</label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
              />
            </div>
          </div>

          <div className="proforma-lineas">
            <div className="admin-fila-controles">
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--color-primario)", fontWeight: "bold" }}>
                Partidas de Mecanizado
              </label>
              <button
                type="button"
                className="btn-secundario btn-sm"
                onClick={handleAddLine}
              >
                <span className="material-symbols-outlined">add</span>
                Añadir Ítem
              </button>
            </div>

            {items.map((item) => (
              <div key={item.id} className="proforma-linea-item">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleUpdateLine(item.id, { description: e.target.value })
                  }
                  placeholder="Descripción de la pieza o servicio..."
                />
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateLine(item.id, {
                      quantity: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                  title="Cantidad"
                />
                <input
                  type="number"
                  min={0}
                  step="0.5"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleUpdateLine(item.id, {
                      unitPrice: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  title="Precio Unitario (S/)"
                />
                <button
                  type="button"
                  className="btn-secundario btn-sm btn-peligro"
                  onClick={() => handleRemoveLine(item.id)}
                  title="Quitar partida"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="admin-fila-controles">
            <label className="checkbox-whatsapp">
              <input
                type="checkbox"
                checked={includeIgv}
                onChange={(e) => setIncludeIgv(e.target.checked)}
              />
              <span>Incluir IGV (18%)</span>
            </label>

            <div style={{ textAlign: "right" }}>
              <span className="admin-meta-texto">
                Subtotal: S/ {subtotal.toFixed(2)}{" "}
                {includeIgv ? `| IGV: S/ ${igv.toFixed(2)}` : ""}
              </span>
              <strong style={{ fontSize: "1.25rem", color: "var(--color-primario)" }}>
                Total: S/ {total.toFixed(2)}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="btn-primario ancho-completo"
            onClick={handlePrintPdf}
          >
            <span className="material-symbols-outlined">picture_as_pdf</span>
            Imprimir / Guardar Proforma en PDF
          </button>
        </div>
      </div>
    </div>
  );
}

