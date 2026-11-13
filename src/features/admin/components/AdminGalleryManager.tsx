import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { uploadMediaFile } from "../../../services/cms.service";
import type { GalleryItem, GridSpanVariant } from "../../../types/domain";

export interface AdminGalleryManagerProps {
  items: GalleryItem[];
  isSaving: boolean;
  onSaveItem: (
    item: Omit<GalleryItem, "id"> & { id?: number },
  ) => Promise<unknown>;
  onDeleteItem: (id: number) => Promise<unknown>;
}

interface GalleryEditorFormProps {
  initialItem?: GalleryItem;
  defaultOrder: number;
  isSaving: boolean;
  onSubmit: (item: Omit<GalleryItem, "id"> & { id?: number }) => Promise<void>;
  onCancel: () => void;
}

function isGridSpanVariant(value: string): value is GridSpanVariant {
  return (
    value === "normal" ||
    value === "destacado-grande" ||
    value === "destacado-ancho"
  );
}

function GalleryEditorForm({
  initialItem,
  defaultOrder,
  isSaving,
  onSubmit,
  onCancel,
}: GalleryEditorFormProps) {
  const [title, setTitle] = useState(initialItem?.title ?? "");
  const [badgeText, setBadgeText] = useState(initialItem?.badgeText ?? "");
  const [imageUrl, setImageUrl] = useState(initialItem?.imageUrl ?? "");
  const [gridSpan, setGridSpan] = useState<GridSpanVariant>(
    initialItem?.gridSpan ?? "normal",
  );
  const [displayOrder, setDisplayOrder] = useState(
    initialItem?.displayOrder ?? defaultOrder,
  );
  const [isActive, setIsActive] = useState(initialItem?.isActive ?? true);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadMediaFile(file);
      setImageUrl(uploadedUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSpanChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (isGridSpanVariant(value)) {
      setGridSpan(value);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    await onSubmit({
      id: initialItem?.id,
      title: title.trim(),
      badgeText: badgeText.trim() || undefined,
      imageUrl: imageUrl.trim(),
      gridSpan,
      displayOrder,
      isActive,
    });

    if (!initialItem) {
      setTitle("");
      setBadgeText("");
      setImageUrl("");
      setGridSpan("normal");
      setDisplayOrder(defaultOrder + 1);
    }
  };

  return (
    <form
      className={
        initialItem
          ? "admin-card admin-card-editando formulario"
          : "admin-card formulario"
      }
      onSubmit={handleSubmit}
    >
      <div className="admin-card-header" style={{ marginBottom: "0.5rem" }}>
        <h4>
          {initialItem
            ? `✏️ Editando Pieza de Galería: ${initialItem.title}`
            : "Agregar Pieza / Trabajo a la Galería"}
        </h4>
        {initialItem && (
          <button
            type="button"
            className="btn-secundario btn-sm"
            onClick={onCancel}
          >
            Cancelar Edición
          </button>
        )}
      </div>

      <div className="fila-form">
        <div className="grupo-form">
          <label>Título / Descripción Alt *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Ensamblaje Técnico en Acero Inoxidable"
            required
          />
        </div>
        <div className="grupo-form">
          <label>Etiqueta Visible en Hover (Opcional)</label>
          <input
            type="text"
            value={badgeText}
            onChange={(e) => setBadgeText(e.target.value)}
            placeholder="Ej. Acabado Espejo"
          />
        </div>
      </div>

      <div className="fila-form">
        <div className="grupo-form">
          <label>Imagen (URL o Subida directa) *</label>
          <div className="input-archivo-fila">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/images/galeria1.jpg o sube una foto"
              required
            />
            <label className="btn-secundario btn-subir-archivo">
              <span className="material-symbols-outlined">upload</span>
              {isUploading ? "Subiendo..." : "Subir Foto"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
            </label>
          </div>
        </div>

        <div className="fila-form">
          <div className="grupo-form">
            <label>Tamaño en Grilla (Bento Grid)</label>
            <select
              className="select-industrial"
              value={gridSpan}
              onChange={handleSpanChange}
            >
              <option value="normal">Normal (1x1)</option>
              <option value="destacado-grande">Destacado Grande (2x2)</option>
              <option value="destacado-ancho">Destacado Ancho (2x1)</option>
            </select>
          </div>
          <div className="grupo-form">
            <label>Orden</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value) || 1)}
              min={1}
            />
          </div>
        </div>
      </div>

      <div className="admin-fila-controles">
        <label className="checkbox-whatsapp">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span>Mostrar en la Galería Pública</span>
        </label>

        <div className="admin-botones-grupo">
          {initialItem && (
            <button type="button" className="btn-secundario" onClick={onCancel}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn-primario" disabled={isSaving}>
            <span className="material-symbols-outlined">save</span>
            {isSaving
              ? "Guardando..."
              : initialItem
                ? "Guardar Cambios de Pieza"
                : "Publicar en Galería"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function AdminGalleryManager({
  items,
  isSaving,
  onSaveItem,
  onDeleteItem,
}: AdminGalleryManagerProps) {
  const [editingItem, setEditingItem] = useState<GalleryItem | undefined>();
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const topAnchorRef = useRef<HTMLDivElement>(null);

  const formKey = editingItem
    ? `edit-gallery-${editingItem.id}`
    : "new-gallery";

  const handleSelectEdit = (item: GalleryItem) => {
    setStatusMessage(undefined);
    setErrorMessage(undefined);
    setEditingItem(item);
    topAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="admin-seccion-stack" ref={topAnchorRef}>
      {statusMessage && (
        <div className="alerta-exito-form" role="status">
          <span className="material-symbols-outlined">check_circle</span>
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="alerta-error-form" role="alert">
          {errorMessage}
        </div>
      )}

      <GalleryEditorForm
        key={formKey}
        initialItem={editingItem}
        defaultOrder={items.length + 1}
        isSaving={isSaving}
        onSubmit={async (payload) => {
          setStatusMessage(undefined);
          setErrorMessage(undefined);
          try {
            await onSaveItem(payload);
            setEditingItem(undefined);
            setStatusMessage(
              payload.id
                ? "Pieza de galería actualizada correctamente."
                : "Nueva pieza publicada en la galería.",
            );
          } catch (err) {
            setErrorMessage(
              err instanceof Error
                ? err.message
                : "No se pudo guardar el elemento de galería.",
            );
          }
        }}
        onCancel={() => setEditingItem(undefined)}
      />

      <div className="admin-card">
        <h3>Elementos en Galería ({items.length})</h3>
        <div className="admin-galeria-grid">
          {items.map((item) => (
            <div key={item.id} className="admin-galeria-card">
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="admin-galeria-thumb"
              />
              <div className="admin-galeria-body">
                <strong>{item.title}</strong>
                <span className="admin-meta-texto">
                  Bloque: {item.gridSpan} • Orden: {item.displayOrder} •{" "}
                  {item.isActive ? "Visible" : "Oculto"}
                </span>
                <div
                  className="admin-botones-grupo"
                  style={{ marginTop: "0.75rem" }}
                >
                  <button
                    type="button"
                    className="btn-primario btn-sm"
                    onClick={() => handleSelectEdit(item)}
                  >
                    <span className="material-symbols-outlined">edit</span>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn-secundario btn-sm btn-peligro"
                    onClick={() => {
                      void onDeleteItem(item.id).catch((err: unknown) => {
                        setErrorMessage(
                          err instanceof Error
                            ? err.message
                            : "No se pudo eliminar la pieza.",
                        );
                      });
                    }}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
