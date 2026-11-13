import { useEffect, useState } from "react";
import {
  DEFAULT_EXPERIENCE_STATS,
  DEFAULT_GALLERY_ITEMS,
  DEFAULT_SERVICES,
  DEFAULT_SITE_SETTINGS,
} from "../../data/defaultContent";
import type { MachiningService } from "../../types/domain";
import { ContactSection } from "./components/ContactSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { FooterSection } from "./components/FooterSection";
import { GallerySection } from "./components/GallerySection";
import { HeroSection } from "./components/HeroSection";
import { LandingLayout } from "./components/LandingLayout";
import { NavbarSection } from "./components/NavbarSection";
import { QuoteModal } from "./components/QuoteModal";
import { ServicesSection } from "./components/ServicesSection";
import { useLandingBundle } from "./hooks/useLandingBundle";

export function LandingPage() {
  const { data } = useLandingBundle();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<
    MachiningService | undefined
  >();

  // Regla `rerender-lazy-state-init`: inicialización perezosa de localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("tema_preferido") !== "claro";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove("tema-claro");
      localStorage.setItem("tema_preferido", "oscuro");
    } else {
      document.body.classList.add("tema-claro");
      localStorage.setItem("tema_preferido", "claro");
    }
  }, [isDarkMode]);

  const settings = data?.settings ?? DEFAULT_SITE_SETTINGS;
  const stats = data?.stats ?? DEFAULT_EXPERIENCE_STATS;
  const services = data?.services ?? DEFAULT_SERVICES;
  const gallery = data?.gallery ?? DEFAULT_GALLERY_ITEMS;

  const handleOpenGeneralQuote = () => {
    setSelectedService(undefined);
    setIsModalOpen(true);
  };

  const handleSelectService = (service: MachiningService) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(undefined);
  };

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <>
      <LandingLayout
        navbar={
          <NavbarSection
            brandName={settings.brandName}
            brandSubname={settings.brandSubname}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
            onOpenQuoteModal={handleOpenGeneralQuote}
          />
        }
        hero={
          <HeroSection
            settings={settings}
            onOpenQuoteModal={handleOpenGeneralQuote}
          />
        }
        experience={<ExperienceSection stats={stats} />}
        services={
          <ServicesSection
            services={services}
            onSelectService={handleSelectService}
          />
        }
        gallery={<GallerySection items={gallery} />}
        contact={<ContactSection settings={settings} />}
        footer={
          <FooterSection settings={settings} isDarkMode={isDarkMode} />
        }
      />

      {isModalOpen && (
        <QuoteModal
          whatsappNumber={settings.whatsappNumber}
          selectedService={selectedService}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

