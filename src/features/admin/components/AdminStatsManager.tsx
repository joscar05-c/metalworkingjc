import { useRef, useState, type FormEvent } from "react";
import type { ExperienceStat } from "../../../types/domain";

export interface AdminStatsManagerProps {
  stats: ExperienceStat[];
  isSaving: boolean;
  onSaveStat: (
    stat: Omit<ExperienceStat, "id"> & { id?: number },
  ) => Promise<unknown>;
  onDeleteStat: (id: number) => Promise<unknown>;
}

interface StatFormProps {
  initialStat?: ExperienceStat;
  defaultOrder: number;
  isSaving: boolean;
  onSubmit: (stat: Omit<ExperienceStat, "id"> & { id?: number }) => Promise<void>;
  onCancelEdit: () => void;
}

function StatEditorForm({
  initialStat,
  defaultOrder,
  isSaving,
  onSubmit,
  onCancelEdit,
}: StatFormProps) {
  const [statValue, setStatValue] = useState(initialStat?.statValue ?? "");
  const [statLabel, setStatLabel] = useState(initialStat?.statLabel ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    initialStat?.displayOrder ?? defaultOrder,
  );
  const [isActive, setIsActive] = useState(initialStat?.isActive ?? true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!statValue.trim() || !statLabel.trim()) return;
    await onSubmit({
      id: initialStat?.id,
      statValue: statValue.trim(),
      statLabel: statLabel.trim(),
      displayOrder,
      isActive,
    });
    if (!initialStat) {
      setStatValue("");
      setStatLabel("");
      setDisplayOrder(defaultOrder + 1);
    }
  };

  return (
    <form
      className={
        initialStat
          ? "admin-card admin-card-editando formulario"
          : "admin-card formulario"
      }
      onSubmit={handleSubmit}
    >
      <div className="admin-card-header" style={{ marginBottom: "0.5rem" }}>
        <h4>
          {initialStat
            ? `✏️ Editando Métrica: ${initialStat.statValue} ${initialStat.statLabel}`
            : "Nueva Métrica de Experiencia"}
        </h4>
        {initialStat && (
          <button
            type="button"
            className="btn-secundario btn-sm"
            onClick={onCancelEdit}
          >
            Cancelar Edición
          </button>
        )}
      </div>

      <div className="fila-form fila-tres-columnas">
        <div className="grupo-form">
          <label>Valor (ej. 20+)</label>
          <input
            type="text"
            value={statValue}
            onChange={(e) => setStatValue(e.target.value)}
            placeholder="20+"
            required
          />
        </div>
        <div className="grupo-form">
          <label>Etiqueta (ej. Años de Experiencia)</label>
          <input
            type="text"
            value={statLabel}
            onChange={(e) => setStatLabel(e.target.value)}
            placeholder="Años de Experiencia"
            required
          />
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

      <div className="admin-fila-controles">
        <label className="checkbox-whatsapp">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span>Mostrar en la página pública</span>
        </label>

        <div className="admin-botones-grupo">
          {initialStat && (
            <button
              type="button"
              className="btn-secundario"
              onClick={onCancelEdit}
            >
              Cancelar
            </button>
          )}
          <button type="submit" className="btn-primario" disabled={isSaving}>
            <span className="material-symbols-outlined">save</span>
            {isSaving
              ? "Guardando..."
              : initialStat
                ? "Guardar Cambios"
                : "Agregar Métrica"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function AdminStatsManager({
  stats,
  isSaving,
  onSaveStat,
  onDeleteStat,
}: AdminStatsManagerProps) {
  const [editingStat, setEditingStat] = useState<ExperienceStat | undefined>();
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const topAnchorRef = useRef<HTMLDivElement>(null);

  // Regla `rerender-no-useeffect-state-reset`: remontar formulario usando `key`
  const formKey = editingStat ? `edit-stat-${editingStat.id}` : "new-stat";

  const handleSelectEdit = (stat: ExperienceStat) => {
    setStatusMessage(undefined);
    setErrorMessage(undefined);
    setEditingStat(stat);
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

      <StatEditorForm
        key={formKey}
        initialStat={editingStat}
        defaultOrder={stats.length + 1}
        isSaving={isSaving}
        onSubmit={async (payload) => {
          setStatusMessage(undefined);
          setErrorMessage(undefined);
          try {
            await onSaveStat(payload);
            setEditingStat(undefined);
            setStatusMessage(
              payload.id
                ? "Métrica actualizada correctamente."
                : "Nueva métrica creada correctamente.",
            );
          } catch (err) {
            setErrorMessage(
              err instanceof Error
                ? err.message
                : "No se pudo guardar la métrica.",
            );
          }
        }}
        onCancelEdit={() => setEditingStat(undefined)}
      />

      <div className="admin-card">
        <h3>Métricas Actuales ({stats.length})</h3>
        <div className="admin-lista-items">
          {stats.map((item) => (
            <div key={item.id} className="admin-item-fila">
              <div className="admin-item-info">
                <span className="admin-stat-numero">{item.statValue}</span>
                <div>
                  <strong>{item.statLabel}</strong>
                  <span className="admin-meta-texto">
                    Orden: {item.displayOrder} •{" "}
                    {item.isActive ? "Visible" : "Oculto"}
                  </span>
                </div>
              </div>
              <div className="admin-botones-grupo">
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
                    void onDeleteStat(item.id).catch((err: unknown) => {
                      setErrorMessage(
                        err instanceof Error
                          ? err.message
                          : "No se pudo eliminar la métrica.",
                      );
                    });
                  }}
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
