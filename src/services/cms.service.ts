import { z } from "zod";
import {
  DEFAULT_EXPERIENCE_STATS,
  DEFAULT_GALLERY_ITEMS,
  DEFAULT_QUOTE_REQUESTS,
  DEFAULT_SERVICES,
  DEFAULT_SITE_SETTINGS,
} from "../data/defaultContent";
import { supabaseClient } from "../lib/supabaseClient";
import {
  dbExperienceStatRowSchema,
  dbGalleryItemRowSchema,
  dbQuoteRequestRowSchema,
  dbServiceRowSchema,
  dbSiteSettingsRowSchema,
  mapExperienceStatRow,
  mapGalleryItemRow,
  mapQuoteRequestRow,
  mapServiceRow,
  mapSiteSettingsRow,
} from "../schemas/cms.schema";
import type {
  CreateQuoteInput,
  ExperienceStat,
  GalleryItem,
  LandingBundle,
  MachiningService,
  QuoteRequest,
  QuoteRequestStatus,
  SiteSettings,
} from "../types/domain";

const STORAGE_KEYS = {
  settings: "mwjc_cms_settings_v1",
  stats: "mwjc_cms_stats_v1",
  services: "mwjc_cms_services_v1",
  gallery: "mwjc_cms_gallery_v1",
  quotes: "mwjc_cms_quotes_v1",
} as const;

function readLocalJson<T>(
  key: string,
  schema: z.ZodType<T>,
  fallback: T,
): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    const result = schema.safeParse(parsed);
    return result.success ? result.data : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

const localSettingsSchema = z.object({
  id: z.number(),
  brandName: z.string(),
  brandSubname: z.string(),
  heroBadge: z.string(),
  heroTitleStart: z.string(),
  heroTitleHighlight: z.string(),
  heroTitleEnd: z.string(),
  heroDescription: z.string(),
  heroImageUrl: z.string().optional(),
  toleranceValue: z.string(),
  toleranceUnit: z.string(),
  toleranceLabel: z.string(),
  contactHeading: z.string(),
  contactDescription: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  phoneDisplay: z.string(),
  whatsappNumber: z.string(),
  emailTechnical: z.string(),
  copyrightText: z.string(),
});

const localStatSchema = z.object({
  id: z.number(),
  statValue: z.string(),
  statLabel: z.string(),
  displayOrder: z.number(),
  isActive: z.boolean(),
});

const localServiceSchema = z.object({
  id: z.number(),
  title: z.string(),
  shortDescription: z.string(),
  technicalDetails: z.string().optional(),
  iconMain: z.string(),
  iconBackground: z.string(),
  displayOrder: z.number(),
  isActive: z.boolean(),
});

const localGallerySchema = z.object({
  id: z.number(),
  title: z.string(),
  badgeText: z.string().optional(),
  imageUrl: z.string(),
  gridSpan: z.enum(["normal", "destacado-grande", "destacado-ancho"]),
  displayOrder: z.number(),
  isActive: z.boolean(),
});

const localQuoteSchema = z.object({
  id: z.number(),
  clientName: z.string(),
  companyName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  projectDetails: z.string(),
  source: z.enum(["contacto", "modal", "servicio"]),
  status: z.enum(["pendiente", "en_revision", "cotizado", "archivado"]),
  adminNotes: z.string().optional(),
  createdAt: z.string(),
});

export function getLocalSettings(): SiteSettings {
  return readLocalJson(
    STORAGE_KEYS.settings,
    localSettingsSchema,
    DEFAULT_SITE_SETTINGS,
  );
}

export function getLocalStats(): ExperienceStat[] {
  const list = readLocalJson(
    STORAGE_KEYS.stats,
    z.array(localStatSchema),
    DEFAULT_EXPERIENCE_STATS,
  );
  return list.toSorted((a, b) => a.displayOrder - b.displayOrder);
}

export function getLocalServices(): MachiningService[] {
  const list = readLocalJson(
    STORAGE_KEYS.services,
    z.array(localServiceSchema),
    DEFAULT_SERVICES,
  );
  return list.toSorted((a, b) => a.displayOrder - b.displayOrder);
}

export function getLocalGallery(): GalleryItem[] {
  const list = readLocalJson(
    STORAGE_KEYS.gallery,
    z.array(localGallerySchema),
    DEFAULT_GALLERY_ITEMS,
  );
  return list.toSorted((a, b) => a.displayOrder - b.displayOrder);
}

export function getLocalQuotes(): QuoteRequest[] {
  const list = readLocalJson(
    STORAGE_KEYS.quotes,
    z.array(localQuoteSchema),
    DEFAULT_QUOTE_REQUESTS,
  );
  return list.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Regla `async-parallel`: Ejecuta todas las consultas independientes en paralelo con Promise.all()
 */
export async function fetchLandingBundle(
  includeInactive = false,
): Promise<LandingBundle> {
  if (!supabaseClient) {
    const stats = getLocalStats();
    const services = getLocalServices();
    const gallery = getLocalGallery();
    return {
      settings: getLocalSettings(),
      stats: includeInactive ? stats : stats.filter((s) => s.isActive),
      services: includeInactive ? services : services.filter((s) => s.isActive),
      gallery: includeInactive ? gallery : gallery.filter((g) => g.isActive),
      sourceMode: "local",
    };
  }

  const [settingsRes, statsRes, servicesRes, galleryRes] = await Promise.all([
    supabaseClient.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabaseClient
      .from("experience_stats")
      .select("*")
      .order("display_order", { ascending: true }),
    supabaseClient
      .from("services")
      .select("*")
      .order("display_order", { ascending: true }),
    supabaseClient
      .from("gallery_items")
      .select("*")
      .order("display_order", { ascending: true }),
  ]);

  const parsedSettings = dbSiteSettingsRowSchema.safeParse(settingsRes.data);
  const settings: SiteSettings = parsedSettings.success
    ? {
        ...mapSiteSettingsRow(parsedSettings.data),
        heroImageUrl:
          mapSiteSettingsRow(parsedSettings.data).heroImageUrl ??
          DEFAULT_SITE_SETTINGS.heroImageUrl,
      }
    : getLocalSettings();

  const parsedStats = z.array(dbExperienceStatRowSchema).safeParse(statsRes.data);
  const allStats =
    parsedStats.success && parsedStats.data.length > 0
      ? parsedStats.data
          .map(mapExperienceStatRow)
          .toSorted((a, b) => a.displayOrder - b.displayOrder)
      : getLocalStats();

  const parsedServices = z.array(dbServiceRowSchema).safeParse(servicesRes.data);
  const allServices =
    parsedServices.success && parsedServices.data.length > 0
      ? parsedServices.data
          .map(mapServiceRow)
          .toSorted((a, b) => a.displayOrder - b.displayOrder)
      : getLocalServices();

  const parsedGallery = z
    .array(dbGalleryItemRowSchema)
    .safeParse(galleryRes.data);
  const allGallery =
    parsedGallery.success && parsedGallery.data.length > 0
      ? parsedGallery.data
          .map(mapGalleryItemRow)
          .toSorted((a, b) => a.displayOrder - b.displayOrder)
      : getLocalGallery();

  return {
    settings,
    stats: includeInactive ? allStats : allStats.filter((item) => item.isActive),
    services: includeInactive
      ? allServices
      : allServices.filter((item) => item.isActive),
    gallery: includeInactive
      ? allGallery
      : allGallery.filter((item) => item.isActive),
    sourceMode: "supabase",
  };
}

export async function saveSiteSettings(
  nextSettings: SiteSettings,
): Promise<SiteSettings> {
  writeLocalJson(STORAGE_KEYS.settings, nextSettings);

  if (!supabaseClient) {
    return nextSettings;
  }

  const { data, error } = await supabaseClient
    .from("site_settings")
    .upsert({
      id: 1,
      brand_name: nextSettings.brandName,
      brand_subname: nextSettings.brandSubname,
      hero_badge: nextSettings.heroBadge,
      hero_title_start: nextSettings.heroTitleStart,
      hero_title_highlight: nextSettings.heroTitleHighlight,
      hero_title_end: nextSettings.heroTitleEnd,
      hero_description: nextSettings.heroDescription,
      hero_image_url: nextSettings.heroImageUrl ?? null,
      tolerance_value: nextSettings.toleranceValue,
      tolerance_unit: nextSettings.toleranceUnit,
      tolerance_label: nextSettings.toleranceLabel,
      contact_heading: nextSettings.contactHeading,
      contact_description: nextSettings.contactDescription,
      address_line1: nextSettings.addressLine1,
      address_line2: nextSettings.addressLine2,
      phone_display: nextSettings.phoneDisplay,
      whatsapp_number: nextSettings.whatsappNumber,
      email_technical: nextSettings.emailTechnical,
      copyright_text: nextSettings.copyrightText,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const parsed = dbSiteSettingsRowSchema.safeParse(data);
  return parsed.success ? mapSiteSettingsRow(parsed.data) : nextSettings;
}

export async function upsertExperienceStat(
  stat: Omit<ExperienceStat, "id"> & { id?: number },
): Promise<ExperienceStat> {
  const current = getLocalStats();
  const resolvedId =
    stat.id ??
    (current.reduce((max, item) => Math.max(max, item.id), 0) + 1);
  const updatedItem: ExperienceStat = {
    id: resolvedId,
    statValue: stat.statValue,
    statLabel: stat.statLabel,
    displayOrder: stat.displayOrder,
    isActive: stat.isActive,
  };

  const exists = current.some((item) => item.id === resolvedId);
  const nextList = exists
    ? current.map((item) => (item.id === resolvedId ? updatedItem : item))
    : [...current, updatedItem];
  writeLocalJson(STORAGE_KEYS.stats, nextList);

  if (!supabaseClient) {
    return updatedItem;
  }

  const payload = {
    stat_value: stat.statValue,
    stat_label: stat.statLabel,
    display_order: stat.displayOrder,
    is_active: stat.isActive,
  };

  const query = stat.id
    ? supabaseClient
        .from("experience_stats")
        .update(payload)
        .eq("id", stat.id)
        .select("*")
        .single()
    : supabaseClient
        .from("experience_stats")
        .insert(payload)
        .select("*")
        .single();

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const parsed = dbExperienceStatRowSchema.safeParse(data);
  return parsed.success ? mapExperienceStatRow(parsed.data) : updatedItem;
}

export async function deleteExperienceStat(id: number): Promise<void> {
  const nextList = getLocalStats().filter((item) => item.id !== id);
  writeLocalJson(STORAGE_KEYS.stats, nextList);

  if (!supabaseClient) return;
  const { error } = await supabaseClient
    .from("experience_stats")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function upsertMachiningService(
  service: Omit<MachiningService, "id"> & { id?: number },
): Promise<MachiningService> {
  const current = getLocalServices();
  const resolvedId =
    service.id ??
    (current.reduce((max, item) => Math.max(max, item.id), 0) + 1);
  const updatedItem: MachiningService = {
    id: resolvedId,
    title: service.title,
    shortDescription: service.shortDescription,
    technicalDetails: service.technicalDetails,
    iconMain: service.iconMain,
    iconBackground: service.iconBackground,
    displayOrder: service.displayOrder,
    isActive: service.isActive,
  };

  const exists = current.some((item) => item.id === resolvedId);
  const nextList = exists
    ? current.map((item) => (item.id === resolvedId ? updatedItem : item))
    : [...current, updatedItem];
  writeLocalJson(STORAGE_KEYS.services, nextList);

  if (!supabaseClient) {
    return updatedItem;
  }

  const payload = {
    title: service.title,
    short_description: service.shortDescription,
    technical_details: service.technicalDetails ?? null,
    icon_main: service.iconMain,
    icon_background: service.iconBackground,
    display_order: service.displayOrder,
    is_active: service.isActive,
  };

  const query = service.id
    ? supabaseClient
        .from("services")
        .update(payload)
        .eq("id", service.id)
        .select("*")
        .single()
    : supabaseClient.from("services").insert(payload).select("*").single();

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const parsed = dbServiceRowSchema.safeParse(data);
  return parsed.success ? mapServiceRow(parsed.data) : updatedItem;
}

export async function deleteMachiningService(id: number): Promise<void> {
  const nextList = getLocalServices().filter((item) => item.id !== id);
  writeLocalJson(STORAGE_KEYS.services, nextList);

  if (!supabaseClient) return;
  const { error } = await supabaseClient.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function upsertGalleryItem(
  item: Omit<GalleryItem, "id"> & { id?: number },
): Promise<GalleryItem> {
  const current = getLocalGallery();
  const resolvedId =
    item.id ??
    (current.reduce((max, entry) => Math.max(max, entry.id), 0) + 1);
  const updatedItem: GalleryItem = {
    id: resolvedId,
    title: item.title,
    badgeText: item.badgeText,
    imageUrl: item.imageUrl,
    gridSpan: item.gridSpan,
    displayOrder: item.displayOrder,
    isActive: item.isActive,
  };

  const exists = current.some((entry) => entry.id === resolvedId);
  const nextList = exists
    ? current.map((entry) => (entry.id === resolvedId ? updatedItem : entry))
    : [...current, updatedItem];
  writeLocalJson(STORAGE_KEYS.gallery, nextList);

  if (!supabaseClient) {
    return updatedItem;
  }

  const payload = {
    title: item.title,
    badge_text: item.badgeText ?? null,
    image_url: item.imageUrl,
    grid_span: item.gridSpan,
    display_order: item.displayOrder,
    is_active: item.isActive,
  };

  const query = item.id
    ? supabaseClient
        .from("gallery_items")
        .update(payload)
        .eq("id", item.id)
        .select("*")
        .single()
    : supabaseClient
        .from("gallery_items")
        .insert(payload)
        .select("*")
        .single();

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const parsed = dbGalleryItemRowSchema.safeParse(data);
  return parsed.success ? mapGalleryItemRow(parsed.data) : updatedItem;
}

export async function deleteGalleryItem(id: number): Promise<void> {
  const nextList = getLocalGallery().filter((item) => item.id !== id);
  writeLocalJson(STORAGE_KEYS.gallery, nextList);

  if (!supabaseClient) return;
  const { error } = await supabaseClient
    .from("gallery_items")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createQuoteRequest(
  input: CreateQuoteInput,
): Promise<QuoteRequest> {
  const current = getLocalQuotes();
  const nextId =
    current.reduce((max, entry) => Math.max(max, entry.id), 0) + 1;
  const createdQuote: QuoteRequest = {
    id: nextId,
    clientName: input.clientName.trim(),
    companyName: input.companyName?.trim() || undefined,
    email: input.email?.trim() || undefined,
    phone: input.phone?.trim() || undefined,
    projectDetails: input.projectDetails.trim(),
    source: input.source,
    status: "pendiente",
    createdAt: new Date().toISOString(),
  };

  writeLocalJson(STORAGE_KEYS.quotes, [createdQuote, ...current]);

  if (!supabaseClient) {
    return createdQuote;
  }

  const { error } = await supabaseClient.from("quote_requests").insert({
    client_name: createdQuote.clientName,
    company_name: createdQuote.companyName ?? null,
    email: createdQuote.email ?? null,
    phone: createdQuote.phone ?? null,
    project_details: createdQuote.projectDetails,
    source: createdQuote.source,
    status: "pendiente",
  });

  if (error) {
    throw new Error(error.message);
  }

  return createdQuote;
}

export async function fetchQuoteRequests(): Promise<QuoteRequest[]> {
  if (!supabaseClient) {
    return getLocalQuotes();
  }

  const { data, error } = await supabaseClient
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return getLocalQuotes();
  }

  const parsed = z.array(dbQuoteRequestRowSchema).safeParse(data);
  if (!parsed.success) {
    return getLocalQuotes();
  }

  return parsed.data
    .map(mapQuoteRequestRow)
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateQuoteRequestStatus(
  id: number,
  status: QuoteRequestStatus,
  adminNotes?: string,
): Promise<void> {
  const current = getLocalQuotes();
  const nextList = current.map((item) =>
    item.id === id ? { ...item, status, adminNotes } : item,
  );
  writeLocalJson(STORAGE_KEYS.quotes, nextList);

  if (!supabaseClient) return;

  const { error } = await supabaseClient
    .from("quote_requests")
    .update({
      status,
      admin_notes: adminNotes ?? null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteQuoteRequest(id: number): Promise<void> {
  const nextList = getLocalQuotes().filter((item) => item.id !== id);
  writeLocalJson(STORAGE_KEYS.quotes, nextList);

  if (!supabaseClient) return;
  const { error } = await supabaseClient
    .from("quote_requests")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function uploadMediaFile(file: File): Promise<string> {
  if (supabaseClient) {
    const safeExt = file.name.split(".").pop() ?? "jpg";
    const filePath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
    const { error } = await supabaseClient.storage
      .from("mwjc-media")
      .upload(filePath, file, { upsert: true });

    if (!error) {
      const { data } = supabaseClient.storage
        .from("mwjc-media")
        .getPublicUrl(filePath);
      return data.publicUrl;
    }
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("No se pudo leer la imagen seleccionada."));
      }
    };
    reader.onerror = () =>
      reject(new Error("Error al leer el archivo de imagen."));
    reader.readAsDataURL(file);
  });
}

