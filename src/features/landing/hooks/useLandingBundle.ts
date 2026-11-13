import { useQuery } from "@tanstack/react-query";
import { fetchLandingBundle } from "../../../services/cms.service";

export const LANDING_QUERY_KEY = ["cms", "landing-bundle"] as const;
export const ADMIN_BUNDLE_QUERY_KEY = ["cms", "admin-bundle"] as const;

export function useLandingBundle() {
  return useQuery({
    queryKey: LANDING_QUERY_KEY,
    queryFn: () => fetchLandingBundle(false),
  });
}

export function useAdminBundle() {
  return useQuery({
    queryKey: ADMIN_BUNDLE_QUERY_KEY,
    queryFn: () => fetchLandingBundle(true),
  });
}

