import { useState, type ChangeEvent, type FormEvent } from "react";
import { uploadMediaFile } from "../../../services/cms.service";
import type { SiteSettings } from "../../../types/domain";

export interface AdminSettingsEditorProps {
  initialSettings: SiteSettings;
  isSaving: boolean;
  onSave: (settings: SiteSettings) => void;
}

export function AdminSettingsEditor({
  initialSettings,
  isSaving,
  onSave,
}: AdminSettingsEditorProps) {
  const [formState, setFormState] = useState<SiteSettings>(initialSettings);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const updateField = <K extends keyof SiteSettings>(
    field: K,
    value: SiteSettings[K],
  ) => {
    setSavedNotice(false);
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleHeroFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadMediaFile(file);
      updateField("heroImageUrl", uploadedUrl);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(formState);
    setSavedNotice(true);
  };

  return (
    <form className="admin-card formulario" onSubmit={handleSubmit}>
      <div className="admin-card-header">
        <div>
          <h3>Identidad, Hero y Datos de Contacto</h3>
          <p>
            Personaliza los textos principales, tolerancia destacada, imagen de
            portada y canales de atención directa.
          </p>
        </div>
        {savedNotice && (
          <span className="badge-estado badge-cotizado">Cambios guardados</span>
        )}
      </div>

      <h4 className="admin-subtitulo-bloque">1. Marca y Portada (Hero)</h4>
      <div className="fila-form">
        <div className="grupo-form">
          <label>Nombre de Marca</label>
          <input
            type="text"
            value={formState.brandName}
            onChange={(e) => updateField("brandName", e.target.value)}
            required
          />
        </div>
        <div className="grupo-form">
          <label>Submarca / Siglas</label>
          <input
            type="text"
            value={formState.brandSubname}
            onChange={(e) => updateField("brandSubname", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="fila-form">
        <div className="grupo-form">
          <label>Etiqueta Superior del Hero</label>
          <input
            type="text"
            value={formState.heroBadge}
            onChange={(e) => updateField("heroBadge", e.target.value)}
            required
          />
        </div>
        <div className="grupo-form">
          <label>Imagen de Fondo (URL o Subir archivo)</label>
          <div className="input-archivo-fila">
            <input
              type="text"
              value={formState.heroImageUrl ?? ""}
              onChange={(e) =>
                updateField("heroImageUrl", e.target.value || undefined)
              }
              placeholder="https://... o sube una imagen"
            />
            <label className="btn-secundario btn-subir-archivo">
              <span className="material-symbols-outlined">upload</span>
              {uploadingImage ? "Subiendo..." : "Subir"}
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroFileUpload}
                hidden
              />
            </label>
          </div>
        </div>
      </div>

      <div className="fila-form fila-tres-columnas">
        <div className="grupo-form">
          <label>Título (Inicio)</label>
          <input
            type="text"
            value={formState.heroTitleStart}
            onChange={(e) => updateField("heroTitleStart", e.target.value)}
            required
          />
        </div>
        <div className="grupo-form">
          <label>Palabra Destacada (Naranja)</label>
          <input
            type="text"
            value={formState.heroTitleHighlight}
            onChange={(e) => updateField("heroTitleHighlight", e.target.value)}
            required
          />
        </div>
        <div className="grupo-form">
          <label>Título (Final)</label>
          <input
            type="text"
            value={formState.heroTitleEnd}
            onChange={(e) => updateField("heroTitleEnd", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grupo-form">
        <label>Descripción Principal del Hero</label>
        <textarea
          rows={3}
          value={formState.heroDescription}
          onChange={(e) => updateField("heroDescription", e.target.value)}
          required
        />
      </div>

      <div className="fila-form fila-tres-columnas">
        <div className="grupo-form">
          <label>Valor de Tolerancia Flotante</label>
          <input
            type="text"
            value={formState.toleranceValue}
            onChange={(e) => updateField("toleranceValue", e.target.value)}
            required
          />
        </div>
        <div className="grupo-form">
          <label>Unidad (ej. mm)</label>
          <input
            type="text"
            value={formState.toleranceUnit}
            onChange={(e) => updateField("toleranceUnit", e.target.value)}
            required
          />
        </div>
        <div className="grupo-form">
          <label>Etiqueta de Tolerancia</label>
          <input
            type="text"
            value={formState.toleranceLabel}
            onChange={(e) => updateField("toleranceLabel", e.target.value)}
            required
          />
        </div>
      </div>

      <h4 className="admin-subtitulo-bloque">2. Información de Contacto y WhatsApp</h4>
      <div className="fila-form">
        <div className="grupo-form">
          <label>Título de Sección Contacto</label>
          <input
            type="text"
            value={formState.contactHeading}
            onChange={(e) => updateField("contactHeading", e.target.value)}
            required
          />
        </div>
        <div className="grupo-form">
          <label>Correo Técnico</label>
          <input
            type="email"
            value={formState.emailTechnical}
            onChange={(e) => updateField("emailTechnical", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grupo-form">
        <label>Texto descriptivo de Contacto</label>
        <textarea
          rows={2}
          value={formState.contactDescription}
          onChange={(e) => updateField("contactDescription", e.target.value)}
          required
        />
      </div>

      <div className="fila-form">
        <div className="grupo-form">
          <label>Dirección (Línea 1)</label>
          <input
            type="text"
            value={formState.addressLine1}
            onChange={(e) => updateField("addressLine1", e.target.value)}
            required
          />
        </div>
        <div className="grupo-form">
          <label>Ciudad / Región (Línea 2)</label>
          <input
            type="text"
            value={formState.addressLine2}
            onChange={(e) => updateField("addressLine2", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="fila-form">
        <div className="grupo-form">
          <label>Teléfono Visible</label>
          <input
            type="text"
            value={formState.phoneDisplay}
            onChange={(e) => updateField("phoneDisplay", e.target.value)}
            required
          />
        </div>
        <div className="grupo-form">
          <label>Número de WhatsApp (con código de país, ej. 51927885314)</label>
          <input
            type="text"
            value={formState.whatsappNumber}
            onChange={(e) => updateField("whatsappNumber", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grupo-form">
        <label>Texto de Copyright (Pie de página)</label>
        <input
          type="text"
          value={formState.copyrightText}
          onChange={(e) => updateField("copyrightText", e.target.value)}
          required
        />
      </div>

      <div className="admin-acciones-derecha">
        <button type="submit" className="btn-primario" disabled={isSaving}>
          <span className="material-symbols-outlined">save</span>
          {isSaving ? "Guardando..." : "Guardar Configuración General"}
        </button>
      </div>
    </form>
  );
}

