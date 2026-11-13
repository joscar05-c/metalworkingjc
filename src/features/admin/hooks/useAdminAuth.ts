import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabaseClient } from "../../../lib/supabaseClient";

const LOCAL_ADMIN_SESSION_KEY = "mwjc_admin_session_active";
const DEFAULT_LOCAL_PASSCODE = "admin2026";

export interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail?: string;
  mode: "supabase" | "local";
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAdminAuth(): AdminAuthState {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (isSupabaseConfigured) return false;
    return sessionStorage.getItem(LOCAL_ADMIN_SESSION_KEY) === "true";
  });
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);
  const [userEmail, setUserEmail] = useState<string | undefined>(() => {
    if (isSupabaseConfigured) return undefined;
    return sessionStorage.getItem(LOCAL_ADMIN_SESSION_KEY) === "true"
      ? "admin@metalworkingjc.pe"
      : undefined;
  });

  useEffect(() => {
    if (!supabaseClient) {
      return;
    }

    let active = true;

    void supabaseClient.auth.getSession().then(({ data }) => {
      if (!active) return;
      const sessionUser = data.session?.user;
      setIsAuthenticated(Boolean(sessionUser));
      setUserEmail(sessionUser?.email ?? undefined);
      setIsLoading(false);
    });

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;
        setIsAuthenticated(Boolean(session?.user));
        setUserEmail(session?.user?.email ?? undefined);
        setIsLoading(false);
      },
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    if (supabaseClient) {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      return;
    }

    if (password.trim() !== DEFAULT_LOCAL_PASSCODE) {
      throw new Error(
        "Contraseña local incorrecta. En modo demostración usa: admin2026",
      );
    }

    sessionStorage.setItem(LOCAL_ADMIN_SESSION_KEY, "true");
    setUserEmail(email.trim() || "admin@metalworkingjc.pe");
    setIsAuthenticated(true);
  };

  const signOut = async (): Promise<void> => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    sessionStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setUserEmail(undefined);
  };

  return {
    isAuthenticated,
    isLoading,
    userEmail,
    mode: isSupabaseConfigured ? "supabase" : "local",
    signIn,
    signOut,
  };
}

