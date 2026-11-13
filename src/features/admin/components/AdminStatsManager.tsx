import { useState, type FormEvent } from "react";
import type { ExperienceStat } from "../../../types/domain";

export interface AdminStatsManagerProps {
  stats: ExperienceStat[];
  isSaving: boolean;
  onSaveStat: (stat: Omit<ExperienceStat, "id"> & { id?: number }) => void;
  onDeleteStat: (id: number) => void;
}

interface StatFormProps {
  initialStat?: ExperienceStat;
  defaultOrder: number;
  isSaving: boolean;
  onSubmit: (stat: Omit<ExperienceStat, "id"> & { id?: number }) => void;
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!statValue.trim() || !statLabel.trim()) return;
    onSubmit({
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
    <form className="admin-card formulario" onSubmit={handleSubmit}>
      <h4>
        {initialStat
          ? `Editando Métrica #${initialStat.id}`
          : "Nueva Métrica de Experiencia"}
      </h4>
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
            {initialStat ? "Actualizar Métrica" : "Agregar Métrica"}
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

  // Regla `rerender-no-useeffect-state-reset`: remontar formulario usando `key`
  const formKey = editingStat ? `edit-stat-${editingStat.id}` : "new-stat";

  return (
    <div className="admin-seccion-stack">
      <StatEditorForm
        key={formKey}
        initialStat={editingStat}
        defaultOrder={stats.length + 1}
        isSaving={isSaving}
        onSubmit={(payload) => {
          onSaveStat(payload);
          setEditingStat(undefined);
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
                  className="btn-secundario btn-sm"
                  onClick={() => setEditingStat(item)}
                >
                  <span className="material-symbols-outlined">edit</span>
                  Editar
                </button>
                <button
                  type="button"
                  className="btn-secundario btn-sm btn-peligro"
                  onClick={() => onDeleteStat(item.id)}
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

