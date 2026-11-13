import heroImg from "../assets/HERO2.jpg";
import imgGaleria1 from "../assets/galeria1.jpg";
import imgGaleria2 from "../assets/galeria2.jpg";
import imgGaleria3 from "../assets/galeria3.jpg";
import imgGaleria4 from "../assets/galeria4.jpg";
import type {
  ExperienceStat,
  GalleryItem,
  MachiningService,
  QuoteRequest,
  SiteSettings,
} from "../types/domain";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 1,
  brandName: "Metal Working",
  brandSubname: "JC",
  heroBadge: "Taller de Alta Precisión",
  heroTitleStart: "Precisión",
  heroTitleHighlight: "Milimétrica",
  heroTitleEnd: "en Cada Pieza",
  heroDescription:
    "Fabricación industrial de piezas personalizadas, reparación de componentes y mecanizado CNC con los más altos estándares de tolerancia.",
  heroImageUrl: heroImg,
  toleranceValue: "0.005",
  toleranceUnit: "mm",
  toleranceLabel: "Tolerancia Máxima",
  contactHeading: "Solicite su Cotización",
  contactDescription:
    "Nuestro equipo técnico revisará sus planos y requerimientos para enviarle una propuesta detallada en menos de 24 horas.",
  addressLine1: "Jr. Los Girasoles 220",
  addressLine2: "Rioja, San Martín, Perú",
  phoneDisplay: "+51 927885314",
  whatsappNumber: "51927885314",
  emailTechnical: "pizangojosec@gmail.com",
  copyrightText: "© 2026 Metal Working JC. Todos los derechos reservados.",
};

export const DEFAULT_EXPERIENCE_STATS: ExperienceStat[] = [
  {
    id: 1,
    statValue: "20+",
    statLabel: "Años de Experiencia",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    statValue: "15+",
    statLabel: "Máquinas Especializadas",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    statValue: "10+",
    statLabel: "Técnicos Expertos",
    displayOrder: 3,
    isActive: true,
  },
];

export const DEFAULT_SERVICES: MachiningService[] = [
  {
    id: 1,
    title: "Torneado CNC",
    shortDescription:
      "Mecanizado de precisión para ejes, casquillos y piezas cilíndricas con acabados de alta calidad.",
    technicalDetails:
      "Tolerancias de hasta ±0.005 mm en aceros inoxidables, aceros al carbono, bronce, aluminio y polímeros de ingeniería. Producción unitaria y por lotes bajo plano.",
    iconMain: "precision_manufacturing",
    iconBackground: "settings",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    title: "Fresado",
    shortDescription:
      "Cortes y formas complejas en 3 y 4 ejes para componentes que requieren exactitud geométrica.",
    technicalDetails:
      "Fabricación de engranajes rectos y helicoidales, chaveteros, matrices, bridas especiales y carcasas industriales con control dimensional estricto.",
    iconMain: "architecture",
    iconBackground: "grid_on",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    title: "Rectificado",
    shortDescription:
      "Acabados perfectos para superficies planas y cilíndricas, garantizando paralelismo.",
    technicalDetails:
      "Rectificado tangencial y cilíndrico de alta precisión para recuperar ejes desgastados, asientos de rodamientos y superficies de sellado crítico.",
    iconMain: "texture",
    iconBackground: "blur_on",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    title: "Taladrado y Roscado",
    shortDescription:
      "Perforaciones axiales exactas y creación de roscas internas o externas.",
    technicalDetails:
      "Roscas métricas, Whitworth, NPT, Acme y trapezoidales de potencia para husillos, espárragos de alta resistencia y acoples hidráulicos.",
    iconMain: "construction",
    iconBackground: "handyman",
    displayOrder: 4,
    isActive: true,
  },
];

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: "Ensamblaje Técnico",
    badgeText: "Ensamblaje Técnico",
    imageUrl: imgGaleria1,
    gridSpan: "destacado-grande",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    title: "Pieza de precisión",
    imageUrl: imgGaleria2,
    gridSpan: "normal",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    title: "Herramientas",
    imageUrl: imgGaleria3,
    gridSpan: "normal",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    title: "Acabado Espejo",
    badgeText: "Acabado Espejo",
    imageUrl: imgGaleria4,
    gridSpan: "destacado-ancho",
    displayOrder: 4,
    isActive: true,
  },
];

export const DEFAULT_QUOTE_REQUESTS: QuoteRequest[] = [
  {
    id: 1,
    clientName: "Carlos Mendoza",
    companyName: "Agroindustrial Selva S.A.C.",
    email: "cmendoza@agroselva.pe",
    phone: "+51 942 110 223",
    projectDetails:
      "Requerimos el mecanizado de 4 ejes escalonados en acero SAE 4140 bonificado, longitud 650mm, tolerancia H7 en asientos de rodamiento.",
    source: "contacto",
    status: "pendiente",
    createdAt: new Date().toISOString(),
  },
];

