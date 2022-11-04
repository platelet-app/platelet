import React from "react";
import { makeStyles, Divider, Container } from "@material-ui/core";
import { Section, SectionAlternate } from "components/organisms";
import { GetStarted, Features, Hero, DialogShowcase } from "./components";
import DashboardShowcase from "./components/DashboardShowcase";
import MobileShowcase from "./components/MobileShowcase";
import AboutPlatelet from "views/AboutPlatelet";
import AboutBloodBikes from "views/AboutBloodBikes";

const useStyles = makeStyles(() => ({
  sectionAlternateNoPaddingTop: {
    "& .section-alternate__content": {
      paddingBottom: 0,
    },
  },
  dividerSection: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

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
        <AboutPlatelet />
      </SectionAlternate>
      <Section>
        <AboutBloodBikes />
      </Section>
    </div>
  );
};

export default IndexView;
