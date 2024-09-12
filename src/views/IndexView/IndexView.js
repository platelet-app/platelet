import React from "react";
import { Section, SectionAlternate } from "components/organisms";
import { Features, Hero, DialogShowcase } from "./components";
import DashboardShowcase from "./components/DashboardShowcase";
import MobileShowcase from "./components/MobileShowcase";
import AboutPlatelet from "views/AboutPlatelet";
import Testimonials from "views/Testimonials";

const IndexView = ({ themeMode }) => {
  return (
    <div style={{ width: "100%" }}>
      <Hero themeMode={themeMode} />
      <SectionAlternate>
        <DashboardShowcase themeMode={themeMode} />
      </SectionAlternate>
      <Section>
        <DialogShowcase themeMode={themeMode} />
      </Section>
      <SectionAlternate>
        <MobileShowcase themeMode={themeMode} />
      </SectionAlternate>
      <Section>
        <Features />
      </Section>
      <SectionAlternate>
        <Testimonials />
      </SectionAlternate>
      <Section>
        <AboutPlatelet />
      </Section>
    </div>
  );
};

export default IndexView;
