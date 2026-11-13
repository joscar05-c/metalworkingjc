import type { ExperienceStat } from "../../../types/domain";

export interface ExperienceSectionProps {
  stats: ExperienceStat[];
}

export function ExperienceSection({ stats }: ExperienceSectionProps) {
  return (
    <section id="experiencia" className="seccion-experiencia">
      <div className="estadisticas-contenedor">
        {stats.map((item) => (
          <div key={item.id} className="estadistica-item">
            <span className="numero">{item.statValue}</span>
            <span className="texto">{item.statLabel}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

