import { useState } from "react";
import { Link } from "react-router";
import {
  DEFAULT_EXPERIENCE_STATS,
  DEFAULT_GALLERY_ITEMS,
  DEFAULT_SERVICES,
  DEFAULT_SITE_SETTINGS,
} from "../../data/defaultContent";
import { useAdminBundle } from "../landing/hooks/useLandingBundle";
import { AdminGalleryManager } from "./components/AdminGalleryManager";
import { AdminLoginView } from "./components/AdminLoginView";
import { AdminQuotesInbox } from "./components/AdminQuotesInbox";
import { AdminServicesManager } from "./components/AdminServicesManager";
import { AdminSettingsEditor } from "./components/AdminSettingsEditor";
import { AdminStatsManager } from "./components/AdminStatsManager";
import { useAdminAuth } from "./hooks/useAdminAuth";
import {
  useAdminCmsMutations,
  useAdminQuotesQuery,
} from "./hooks/useAdminCmsMutations";

type AdminTab = "quotes" | "settings" | "services" | "gallery" | "stats";

export default function AdminDashboardPage() {
  const auth = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("quotes");

  const { data: bundle } = useAdminBundle();
  const { data: quotes = [] } = useAdminQuotesQuery();
  const mutations = useAdminCmsMutations();

  // Regla `structure-early-return-render-branches`: guardas tempranas claras
  if (auth.isLoading) {
    return (
      <div className="admin-login-wrapper">
        <p>Verificando sesión de administrador...</p>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <AdminLoginView mode={auth.mode} onSignIn={auth.signIn} />;
  }

  const settings = bundle?.settings ?? DEFAULT_SITE_SETTINGS;
  const stats = bundle?.stats ?? DEFAULT_EXPERIENCE_STATS;
  const services = bundle?.services ?? DEFAULT_SERVICES;
  const gallery = bundle?.gallery ?? DEFAULT_GALLERY_ITEMS;
  const pendingCount = quotes.filter((q) => q.status === "pendiente").length;

  return (
    <div className="admin-shell">
      <header className="barra-navegacion">
        <div className="contenedor-nav">
          <div className="logo-grupo">
            <div className="logo-icono">
              <img
                src="/logo-oscuro.png"
                alt="Logo Metal Working JC"
                className="img-logo logo-blanco"
              />
            </div>
            <div className="logo-texto">
              <span className="marca">CMS Metal Working JC</span>
              <span className="submarca">
                {auth.mode === "supabase"
                  ? "Conectado a Supabase Cloud"
                  : "Modo Local Persistente"}
              </span>
            </div>
          </div>

          <div className="nav-botones">
            <Link to="/" className="btn-secundario btn-sm">
              <span className="material-symbols-outlined">visibility</span>
              Ver Sitio Público
            </Link>
            <button
              type="button"
              className="btn-secundario btn-sm"
              onClick={() => void auth.signOut()}
            >
              <span className="material-symbols-outlined">logout</span>
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="contenedor admin-layout">
        <aside className="admin-sidebar">
          <button
            type="button"
            className={
              activeTab === "quotes"
                ? "admin-tab-btn activo"
                : "admin-tab-btn"
            }
            onClick={() => setActiveTab("quotes")}
          >
            <span className="material-symbols-outlined">inbox</span>
            <span>Cotizaciones</span>
            {pendingCount > 0 && (
              <span className="admin-contador-badge">{pendingCount}</span>
            )}
          </button>

          <button
            type="button"
            className={
              activeTab === "settings"
                ? "admin-tab-btn activo"
                : "admin-tab-btn"
            }
            onClick={() => setActiveTab("settings")}
          >
            <span className="material-symbols-outlined">tune</span>
            <span>Hero y Contacto</span>
          </button>

          <button
            type="button"
            className={
              activeTab === "services"
                ? "admin-tab-btn activo"
                : "admin-tab-btn"
            }
            onClick={() => setActiveTab("services")}
          >
            <span className="material-symbols-outlined">
              precision_manufacturing
            </span>
            <span>Servicios ({services.length})</span>
          </button>

          <button
            type="button"
            className={
              activeTab === "gallery"
                ? "admin-tab-btn activo"
                : "admin-tab-btn"
            }
            onClick={() => setActiveTab("gallery")}
          >
            <span className="material-symbols-outlined">photo_library</span>
            <span>Galería ({gallery.length})</span>
          </button>

          <button
            type="button"
            className={
              activeTab === "stats" ? "admin-tab-btn activo" : "admin-tab-btn"
            }
            onClick={() => setActiveTab("stats")}
          >
            <span className="material-symbols-outlined">monitoring</span>
            <span>Experiencia ({stats.length})</span>
          </button>
        </aside>

        <section className="admin-contenido-principal">
          {activeTab === "quotes" && (
            <AdminQuotesInbox
              quotes={quotes}
              onUpdateStatus={(id, status, adminNotes) =>
                mutations.updateQuoteMutation.mutate({ id, status, adminNotes })
              }
              onDeleteQuote={(id) => mutations.removeQuoteMutation.mutate(id)}
            />
          )}

          {activeTab === "settings" && (
            <AdminSettingsEditor
              key={`settings-${settings.id}`}
              initialSettings={settings}
              isSaving={mutations.settingsMutation.isPending}
              onSave={(nextSettings) =>
                mutations.settingsMutation.mutate(nextSettings)
              }
            />
          )}

          {activeTab === "services" && (
            <AdminServicesManager
              services={services}
              isSaving={mutations.saveServiceMutation.isPending}
              onSaveService={(service) =>
                mutations.saveServiceMutation.mutate(service)
              }
              onDeleteService={(id) =>
                mutations.removeServiceMutation.mutate(id)
              }
            />
          )}

          {activeTab === "gallery" && (
            <AdminGalleryManager
              items={gallery}
              isSaving={mutations.saveGalleryMutation.isPending}
              onSaveItem={(item) => mutations.saveGalleryMutation.mutate(item)}
              onDeleteItem={(id) => mutations.removeGalleryMutation.mutate(id)}
            />
          )}

          {activeTab === "stats" && (
            <AdminStatsManager
              stats={stats}
              isSaving={mutations.saveStatMutation.isPending}
              onSaveStat={(stat) => mutations.saveStatMutation.mutate(stat)}
              onDeleteStat={(id) => mutations.removeStatMutation.mutate(id)}
            />
          )}
        </section>
      </div>
    </div>
  );
}

