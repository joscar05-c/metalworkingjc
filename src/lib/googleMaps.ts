const DEFAULT_GOOGLE_MAPS_API_KEY =
  "AIzaSyDM8sQ2Fc0ftlGpJnVkdXUW7IWttzOdM1I";

export type GoogleMapType = "roadmap" | "satellite";

export const googleMapsApiKey: string =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ||
  DEFAULT_GOOGLE_MAPS_API_KEY;

export function resolveMapQuery(
  addressLine1: string,
  addressLine2: string,
  customMapQuery?: string,
): string {
  const custom = customMapQuery?.trim();
  if (custom) {
    return custom;
  }
  return [addressLine1.trim(), addressLine2.trim()]
    .filter((part) => part.length > 0)
    .join(", ");
}

export function isLocalDevelopmentHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

export function buildGoogleMapsFallbackEmbedUrl(
  query: string,
  mapType: GoogleMapType = "roadmap",
): string {
  const encodedQuery = encodeURIComponent(query.trim());
  const legacyTypeParam = mapType === "satellite" ? "k" : "m";
  return `https://maps.google.com/maps?q=${encodedQuery}&hl=es&t=${legacyTypeParam}&z=16&ie=UTF8&iwloc=A&output=embed`;
}

export function buildGoogleMapsEmbedUrl(
  query: string,
  mapType: GoogleMapType = "roadmap",
): string {
  const encodedQuery = encodeURIComponent(query.trim());
  if (googleMapsApiKey && !isLocalDevelopmentHost()) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(googleMapsApiKey)}&q=${encodedQuery}&zoom=16&maptype=${mapType}&language=es`;
  }
  return buildGoogleMapsFallbackEmbedUrl(query, mapType);
}

export function buildGoogleMapsDirectionsUrl(query: string): string {
  const encodedQuery = encodeURIComponent(query.trim());
  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}
