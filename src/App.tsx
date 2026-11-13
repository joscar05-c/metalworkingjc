import { lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { LandingPage } from "./features/landing/LandingPage";
import { queryClient } from "./lib/queryClient";
import "./index.css";

// Regla `bundle-defer-third-party`: diferir el código del Panel Admin fuera del bundle principal de la Landing
const AdminDashboardPage = lazy(
  () => import("./features/admin/AdminDashboardPage"),
);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/admin/*"
            element={
              <Suspense
                fallback={
                  <div className="admin-login-wrapper">
                    <p>Cargando Panel Administrable...</p>
                  </div>
                }
              >
                <AdminDashboardPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

