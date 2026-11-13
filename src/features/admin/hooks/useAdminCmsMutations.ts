import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteExperienceStat,
  deleteGalleryItem,
  deleteMachiningService,
  deleteQuoteRequest,
  fetchQuoteRequests,
  saveSiteSettings,
  updateQuoteRequestStatus,
  upsertExperienceStat,
  upsertGalleryItem,
  upsertMachiningService,
} from "../../../services/cms.service";
import type {
  ExperienceStat,
  GalleryItem,
  MachiningService,
  QuoteRequestStatus,
  SiteSettings,
} from "../../../types/domain";
import { ADMIN_QUOTES_QUERY_KEY } from "../../landing/hooks/useCreateQuoteMutation";
import {
  ADMIN_BUNDLE_QUERY_KEY,
  LANDING_QUERY_KEY,
} from "../../landing/hooks/useLandingBundle";

export function useAdminQuotesQuery() {
  return useQuery({
    queryKey: ADMIN_QUOTES_QUERY_KEY,
    queryFn: fetchQuoteRequests,
  });
}

export function useAdminCmsMutations() {
  const queryClient = useQueryClient();

  const invalidateAllCms = () => {
    void queryClient.invalidateQueries({ queryKey: LANDING_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: ADMIN_BUNDLE_QUERY_KEY });
  };

  const invalidateQuotes = () => {
    void queryClient.invalidateQueries({ queryKey: ADMIN_QUOTES_QUERY_KEY });
  };

  const settingsMutation = useMutation({
    mutationFn: (settings: SiteSettings) => saveSiteSettings(settings),
    onSuccess: invalidateAllCms,
  });

  const saveStatMutation = useMutation({
    mutationFn: (stat: Omit<ExperienceStat, "id"> & { id?: number }) =>
      upsertExperienceStat(stat),
    onSuccess: invalidateAllCms,
  });

  const removeStatMutation = useMutation({
    mutationFn: (id: number) => deleteExperienceStat(id),
    onSuccess: invalidateAllCms,
  });

  const saveServiceMutation = useMutation({
    mutationFn: (service: Omit<MachiningService, "id"> & { id?: number }) =>
      upsertMachiningService(service),
    onSuccess: invalidateAllCms,
  });

  const removeServiceMutation = useMutation({
    mutationFn: (id: number) => deleteMachiningService(id),
    onSuccess: invalidateAllCms,
  });

  const saveGalleryMutation = useMutation({
    mutationFn: (item: Omit<GalleryItem, "id"> & { id?: number }) =>
      upsertGalleryItem(item),
    onSuccess: invalidateAllCms,
  });

  const removeGalleryMutation = useMutation({
    mutationFn: (id: number) => deleteGalleryItem(id),
    onSuccess: invalidateAllCms,
  });

  const updateQuoteMutation = useMutation({
    mutationFn: (payload: {
      id: number;
      status: QuoteRequestStatus;
      adminNotes?: string;
    }) =>
      updateQuoteRequestStatus(payload.id, payload.status, payload.adminNotes),
    onSuccess: invalidateQuotes,
  });

  const removeQuoteMutation = useMutation({
    mutationFn: (id: number) => deleteQuoteRequest(id),
    onSuccess: invalidateQuotes,
  });

  return {
    settingsMutation,
    saveStatMutation,
    removeStatMutation,
    saveServiceMutation,
    removeServiceMutation,
    saveGalleryMutation,
    removeGalleryMutation,
    updateQuoteMutation,
    removeQuoteMutation,
  };
}

