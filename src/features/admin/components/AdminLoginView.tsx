import { useState, type FormEvent } from "react";
import { Link } from "react-router";

export interface AdminLoginViewProps {
  mode: "supabase" | "local";
  onSignIn: (email: string, password: string) => Promise<void>;
}

export function AdminLoginView({ mode, onSignIn }: AdminLoginViewProps) {
  const [email, setEmail] = useState("admin@metalworkingjc.pe");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(undefined);
    setSubmitting(true);
    try {
      await onSignIn(email, password);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "No se pudo iniciar sesión en el panel.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-wrapper fondo-industrial">
      <div className="admin-login-box">
        <div className="logo-grupo" style={{ marginBottom: "1.5rem" }}>
          <div className="logo-icono">
            <img
              src="/logo-oscuro.png"
              alt="Logo Metal Working JC"
              className="img-logo logo-blanco"
            />
          </div>
          <div className="logo-texto">
            <span className="marca">Metal Working</span>
            <span className="submarca">Panel Administrable JC</span>
          </div>
        </div>

        <h1 className="admin-login-titulo">Acceso al Sistema CMS</h1>
        <p className="admin-login-subtitulo">
          {mode === "supabase"
            ? "Autenticación segura conectada a Supabase Auth."
            : "Modo Local Activo (sin variables VITE_SUPABASE_*). Usa la clave maestra: admin2026"}
        </p>

        <form className="formulario" onSubmit={handleSubmit}>
          <div className="grupo-form">
            <label htmlFor="admin-email">Correo Administrador</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grupo-form">
            <label htmlFor="admin-password">Contraseña</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "local" ? "Ingresa: admin2026" : "Tu contraseña"
              }
              required
            />
          </div>

          {errorMessage && (
            <div className="alerta-error-form" role="alert">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="btn-primario ancho-completo"
            disabled={submitting}
          >
            {submitting ? "Verificando..." : "Ingresar al Panel"}
            <span className="material-symbols-outlined">login</span>
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link to="/" className="enlace-volver-sitio">
            <span className="material-symbols-outlined">arrow_back</span>
            Volver a la Landing Pública
          </Link>
        </div>
      </div>
    </div>
  );
}

