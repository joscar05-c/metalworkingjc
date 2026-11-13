import type { ReactNode } from "react";

export interface LandingLayoutProps {
  navbar: ReactNode;
  hero: ReactNode;
  experience: ReactNode;
  services: ReactNode;
  gallery: ReactNode;
  contact: ReactNode;
  footer: ReactNode;
}

export function LandingLayout({
  navbar,
  hero,
  experience,
  services,
  gallery,
  contact,
  footer,
}: LandingLayoutProps) {
  return (
    <div className="landing-shell">
      {navbar}
      <main>
        {hero}
        {experience}
        {services}
        {gallery}
        {contact}
      </main>
      {footer}
    </div>
  );
}

