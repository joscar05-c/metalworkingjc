import { z } from "zod";
import type {
  ExperienceStat,
  GalleryItem,
  GridSpanVariant,
  MachiningService,
  QuoteRequest,
  QuoteRequestSource,
  QuoteRequestStatus,
  SiteSettings,
} from "../types/domain";

const gridSpanSchema = z.enum(["normal", "destacado-grande", "destacado-ancho"]);
const quoteSourceSchema = z.enum(["contacto", "modal", "servicio"]);
const quoteStatusSchema = z.enum([
  "pendiente",
  "en_revision",
  "cotizado",
  "archivado",
]);

export const dbSiteSettingsRowSchema = z.object({
  id: z.number(),
  brand_name: z.string(),
  brand_subname: z.string(),
  hero_badge: z.string(),
  hero_title_start: z.string(),
  hero_title_highlight: z.string(),
  hero_title_end: z.string(),
  hero_description: z.string(),
  hero_image_url: z.string().nullable().optional(),
  tolerance_value: z.string(),
  tolerance_unit: z.string(),
  tolerance_label: z.string(),
  contact_heading: z.string(),
  contact_description: z.string(),
  address_line1: z.string(),
  address_line2: z.string(),
  phone_display: z.string(),
  whatsapp_number: z.string(),
  email_technical: z.string(),
  copyright_text: z.string(),
});

export const dbExperienceStatRowSchema = z.object({
  id: z.number(),
  stat_value: z.string(),
  stat_label: z.string(),
  display_order: z.number(),
  is_active: z.boolean(),
});

export const dbServiceRowSchema = z.object({
  id: z.number(),
  title: z.string(),
  short_description: z.string(),
  technical_details: z.string().nullable().optional(),
  icon_main: z.string(),
  icon_background: z.string(),
  display_order: z.number(),
  is_active: z.boolean(),
});

export const dbGalleryItemRowSchema = z.object({
  id: z.number(),
  title: z.string(),
  badge_text: z.string().nullable().optional(),
  image_url: z.string(),
  grid_span: gridSpanSchema.catch("normal"),
  display_order: z.number(),
  is_active: z.boolean(),
});

export const dbQuoteRequestRowSchema = z.object({
  id: z.number(),
  client_name: z.string(),
  company_name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  project_details: z.string(),
  attachment_url: z.string().nullable().optional(),
  attachment_name: z.string().nullable().optional(),
  source: quoteSourceSchema.catch("contacto"),
  status: quoteStatusSchema.catch("pendiente"),
  admin_notes: z.string().nullable().optional(),
  created_at: z.string(),
});

function nonEmptyOrUndefined(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Convierte rutas locales de desarrollo de Vite (/src/assets/...) a rutas públicas estáticas (/images/...)
 * para que funcionen tanto en desarrollo local como en producción en Vercel.
 */
export function normalizePublicAssetUrl(
  value: string | null | undefined,
): string | undefined {
  const clean = nonEmptyOrUndefined(value);
  if (!clean) return undefined;
  if (clean.startsWith("/src/assets/")) {
    return clean.replace("/src/assets/", "/images/");
  }
  return clean;
}

const EMBEDDED_ATTACHMENT_REGEX =
  /\n*\[Plano Adjunto \(([^)]+)\)\]: (\S+)\s*$/;

export function extractAttachmentFromDetails(rawDetails: string): {
  cleanDetails: string;
  attachmentName?: string;
  attachmentUrl?: string;
} {
  const match = EMBEDDED_ATTACHMENT_REGEX.exec(rawDetails);
  if (!match) {
    return { cleanDetails: rawDetails };
  }
  return {
    cleanDetails: rawDetails.replace(EMBEDDED_ATTACHMENT_REGEX, "").trim(),
    attachmentName: match[1],
    attachmentUrl: match[2],
  };
}

export function mapSiteSettingsRow(
  row: z.infer<typeof dbSiteSettingsRowSchema>,
): SiteSettings {
  return {
    id: row.id,
    brandName: row.brand_name,
    brandSubname: row.brand_subname,
    heroBadge: row.hero_badge,
    heroTitleStart: row.hero_title_start,
    heroTitleHighlight: row.hero_title_highlight,
    heroTitleEnd: row.hero_title_end,
    heroDescription: row.hero_description,
    heroImageUrl: normalizePublicAssetUrl(row.hero_image_url),
    toleranceValue: row.tolerance_value,
    toleranceUnit: row.tolerance_unit,
    toleranceLabel: row.tolerance_label,
    contactHeading: row.contact_heading,
    contactDescription: row.contact_description,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    phoneDisplay: row.phone_display,
    whatsappNumber: row.whatsapp_number,
    emailTechnical: row.email_technical,
    copyrightText: row.copyright_text,
  };
}

export function mapExperienceStatRow(
  row: z.infer<typeof dbExperienceStatRowSchema>,
): ExperienceStat {
  return {
    id: row.id,
    statValue: row.stat_value,
    statLabel: row.stat_label,
    displayOrder: row.display_order,
    isActive: row.is_active,
  };
}

export function mapServiceRow(
  row: z.infer<typeof dbServiceRowSchema>,
): MachiningService {
  return {
    id: row.id,
    title: row.title,
    shortDescription: row.short_description,
    technicalDetails: nonEmptyOrUndefined(row.technical_details),
    iconMain: row.icon_main,
    iconBackground: row.icon_background,
    displayOrder: row.display_order,
    isActive: row.is_active,
  };
}

export function mapGalleryItemRow(
  row: z.infer<typeof dbGalleryItemRowSchema>,
): GalleryItem {
  const span: GridSpanVariant = row.grid_span;
  return {
    id: row.id,
    title: row.title,
    badgeText: nonEmptyOrUndefined(row.badge_text),
    imageUrl: normalizePublicAssetUrl(row.image_url) ?? "/images/galeria1.jpg",
    gridSpan: span,
    displayOrder: row.display_order,
    isActive: row.is_active,
  };
}

export function mapQuoteRequestRow(
  row: z.infer<typeof dbQuoteRequestRowSchema>,
): QuoteRequest {
  const source: QuoteRequestSource = row.source;
  const status: QuoteRequestStatus = row.status;
  const extracted = extractAttachmentFromDetails(row.project_details);

  return {
    id: row.id,
    clientName: row.client_name,
    companyName: nonEmptyOrUndefined(row.company_name),
    email: nonEmptyOrUndefined(row.email),
    phone: nonEmptyOrUndefined(row.phone),
    projectDetails: extracted.cleanDetails,
    attachmentUrl:
      nonEmptyOrUndefined(row.attachment_url) ?? extracted.attachmentUrl,
    attachmentName:
      nonEmptyOrUndefined(row.attachment_name) ?? extracted.attachmentName,
    source,
    status,
    adminNotes: nonEmptyOrUndefined(row.admin_notes),
    createdAt: row.created_at,
  };
}
