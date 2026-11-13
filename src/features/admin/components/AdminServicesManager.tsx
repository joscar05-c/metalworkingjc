import { useState, type FormEvent } from "react";
import type { MachiningService } from "../../../types/domain";

const SUGGESTED_ICONS = [
  "precision_manufacturing",
  "architecture",
  "texture",
  "construction",
  "settings",
  "build",
  "engineering",
  "handyman",
  "grid_on",
  "blur_on",
  "bolt",
  " straighten",
] as const;

export interface AdminServicesManagerProps {
  services: MachiningService[];
  isSaving: boolean;
  onSaveService: (
    service: Omit<MachiningService, "id"> & { id?: number },
  ) => void;
  onDeleteService: (id: number) => void;
}

interface ServiceEditorFormProps {
  initialService?: MachiningService;
  defaultOrder: number;
  isSaving: boolean;
  onSubmit: (service: Omit<MachiningService, "id"> & { id?: number }) => void;
  onCancel: () => void;
}

function ServiceEditorForm({
  initialService,
  defaultOrder,
  isSaving,
  onSubmit,
  onCancel,
}: ServiceEditorFormProps) {
  const [title, setTitle] = useState(initialService?.title ?? "");
  const [shortDescription, setShortDescription] = useState(
    initialService?.shortDescription ?? "",
  );
  const [technicalDetails, setTechnicalDetails] = useState(
    initialService?.technicalDetails ?? "",
  );
  const [iconMain, setIconMain] = useState(
    initialService?.iconMain ?? "precision_manufacturing",
  );
  const [iconBackground, setIconBackground] = useState(
    initialService?.iconBackground ?? "settings",
  );
  const [displayOrder, setDisplayOrder] = useState(
    initialService?.displayOrder ?? defaultOrder,
  );
  const [isActive, setIsActive] = useState(initialService?.isActive ?? true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !shortDescription.trim()) return;

    onSubmit({
      id: initialService?.id,
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      technicalDetails: technicalDetails.trim() || undefined,
      iconMain: iconMain.trim() || "precision_manufacturing",
      iconBackground: iconBackground.trim() || "settings",
      displayOrder,
      isActive,
    });

    if (!initialService) {
      setTitle("");
      setShortDescription("");
      setTechnicalDetails("");
      setDisplayOrder(defaultOrder + 1);
    }
  };

  return (
    <form className="admin-card formulario" onSubmit={handleSubmit}>
      <h4>
        {initialService
          ? `Editando Servicio: ${initialService.title}`
          : "Agregar Nuevo Servicio de Mecanizado"}
      </h4>

      <div className="fila-form">
        <div className="grupo-form">
          <label>Nombre del Servicio *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Torneado CNC"
            required
          />
        </div>
        <div className="grupo-form">
          <label>Orden de Aparición</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value) || 1)}
            min={1}
          />
        </div>
      </div>

      <div className="fila-form">
        <div className="grupo-form">
          <label>Ícono Principal (Material Symbol)</label>
          <input
            type="text"
            value={iconMain}
            onChange={(e) => setIconMain(e.target.value)}
            list="material-icons-list"
          />
        </div>
        <div className="grupo-form">
          <label>Ícono Decorativo de Fondo</label>
          <input
            type="text"
            value={iconBackground}
            onChange={(e) => setIconBackground(e.target.value)}
            list="material-icons-list"
          />
        </div>
      </div>

      <datalist id="material-icons-list">
        {SUGGESTED_ICONS.map((iconName) => (
          <option key={iconName} value={iconName.trim()} />
        ))}
      </datalist>

      <div className="grupo-form">
        <label>Descripción Corta (Tarjeta) *</label>
        <textarea
          rows={2}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Resumen del servicio visible en la grilla principal..."
          required
        />
      </div>

      <div className="grupo-form">
        <label>Especificaciones / Ficha Técnica (Visible al abrir el modal)</label>
        <textarea
          rows={3}
          value={technicalDetails}
          onChange={(e) => setTechnicalDetails(e.target.value)}
          placeholder="Tolerancias, materiales soportados, capacidades de volteo o longitud..."
        />
      </div>

      <div className="admin-fila-controles">
        <label className="checkbox-whatsapp">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span>Servicio activo en la web pública</span>
        </label>

        <div className="admin-botones-grupo">
          {initialService && (
            <button type="button" className="btn-secundario" onClick={onCancel}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn-primario" disabled={isSaving}>
            <span className="material-symbols-outlined">save</span>
            {initialService ? "Guardar Cambios" : "Crear Servicio"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function AdminServicesManager({
  services,
  isSaving,
  onSaveService,
  onDeleteService,
}: AdminServicesManagerProps) {
  const [editingService, setEditingService] = useState<
    MachiningService | undefined
  >();

  const formKey = editingService
    ? `edit-service-${editingService.id}`
    : "new-service";

  return (
    <div className="admin-seccion-stack">
      <ServiceEditorForm
        key={formKey}
        initialService={editingService}
        defaultOrder={services.length + 1}
        isSaving={isSaving}
        onSubmit={(payload) => {
          onSaveService(payload);
          setEditingService(undefined);
        }}
        onCancel={() => setEditingService(undefined)}
      />

      <div className="admin-card">
        <h3>Catálogo de Servicios ({services.length})</h3>
        <div className="admin-lista-items">
          {services.map((service) => (
            <div key={service.id} className="admin-item-fila">
              <div className="admin-item-info">
                <span className="material-symbols-outlined admin-icono-preview">
                  {service.iconMain}
                </span>
                <div>
                  <strong>{service.title}</strong>
                  <p className="admin-descripcion-corta">
                    {service.shortDescription}
                  </p>
                  <span className="admin-meta-texto">
                    Orden: {service.displayOrder} •{" "}
                    {service.isActive ? "Activo" : "Oculto"}
                  </span>
                </div>
              </div>
              <div className="admin-botones-grupo">
                <button
                  type="button"
                  className="btn-secundario btn-sm"
                  onClick={() => setEditingService(service)}
                >
                  <span className="material-symbols-outlined">edit</span>
                  Editar
                </button>
                <button
                  type="button"
                  className="btn-secundario btn-sm btn-peligro"
                  onClick={() => onDeleteService(service.id)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

