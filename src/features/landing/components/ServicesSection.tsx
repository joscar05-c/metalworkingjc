import type { MachiningService } from "../../../types/domain";

export interface ServicesSectionProps {
  services: MachiningService[];
  onSelectService: (service: MachiningService) => void;
}

export function ServicesSection({
  services,
  onSelectService,
}: ServicesSectionProps) {
  return (
    <section id="servicios" className="seccion-servicios fondo-industrial">
      <div className="contenedor">
        <div className="cabecera-seccion">
          <div>
            <h2 className="subtitulo-seccion">Nuestras Capacidades</h2>
            <h3 className="titulo-seccion">Servicios de Mecanizado</h3>
          </div>
          <p className="texto-apoyo">
            Soluciones integrales desde el diseño hasta el acabado final.
          </p>
        </div>

        <div className="servicios-grid">
          {services.map((service) => (
            <article key={service.id} className="tarjeta-servicio">
              <span className="material-symbols-outlined icono-fondo">
                {service.iconBackground}
              </span>
              <span className="material-symbols-outlined icono-principal">
                {service.iconMain}
              </span>
              <h4>{service.title}</h4>
              <p>{service.shortDescription}</p>
              <button
                type="button"
                onClick={() => onSelectService(service)}
                className="enlace-servicio btn-enlace-servicio"
              >
                Cotizar / Ficha técnica
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

