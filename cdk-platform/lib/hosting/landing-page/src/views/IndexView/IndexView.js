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
      <SectionAlternate>
        <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
          <iframe
            src="https://player.vimeo.com/video/1009494291?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            title="Platelet Dispatch Showcase"
          ></iframe>
        </div>
        <script src="https://player.vimeo.com/api/player.js"></script>
      </SectionAlternate>
    </div>
  );
};

export default IndexView;
