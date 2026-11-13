export type GridSpanVariant = "normal" | "destacado-grande" | "destacado-ancho";

export type QuoteRequestSource = "contacto" | "modal" | "servicio";

export type QuoteRequestStatus =
  | "pendiente"
  | "en_revision"
  | "cotizado"
  | "archivado";

export interface SiteSettings {
  id: number;
  brandName: string;
  brandSubname: string;
  heroBadge: string;
  heroTitleStart: string;
  heroTitleHighlight: string;
  heroTitleEnd: string;
  heroDescription: string;
  heroImageUrl?: string;
  toleranceValue: string;
  toleranceUnit: string;
  toleranceLabel: string;
  contactHeading: string;
  contactDescription: string;
  addressLine1: string;
  addressLine2: string;
  mapQuery?: string;
  phoneDisplay: string;
  whatsappNumber: string;
  emailTechnical: string;
  copyrightText: string;
}

export interface ExperienceStat {
  id: number;
  statValue: string;
  statLabel: string;
  displayOrder: number;
  isActive: boolean;
}

export interface MachiningService {
  id: number;
  title: string;
  shortDescription: string;
  technicalDetails?: string;
  iconMain: string;
  iconBackground: string;
  displayOrder: number;
  isActive: boolean;
}

export interface GalleryItem {
  id: number;
  title: string;
  badgeText?: string;
  imageUrl: string;
  gridSpan: GridSpanVariant;
  displayOrder: number;
  isActive: boolean;
}

export interface QuoteRequest {
  id: number;
  clientName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  projectDetails: string;
  attachmentUrl?: string;
  attachmentName?: string;
  source: QuoteRequestSource;
  status: QuoteRequestStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface CreateQuoteInput {
  clientName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  projectDetails: string;
  attachmentUrl?: string;
  attachmentName?: string;
  source: QuoteRequestSource;
  sendViaWhatsapp: boolean;
}

export interface LandingBundle {
  settings: SiteSettings;
  stats: ExperienceStat[];
  services: MachiningService[];
  gallery: GalleryItem[];
  sourceMode: "supabase" | "local";
}
