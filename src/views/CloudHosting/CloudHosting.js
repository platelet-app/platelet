import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Section, SectionAlternate } from 'components/organisms';
import {
  About,
  Articles,
  Features,
  Hero,
  HowItWorks,
  MobileApp,
  Partners,
  Pricings,
  Reviews,
  Storage,
  Story,
  Support,
} from './components';

import {
  features,
  mobileapp,
  howItWorks,
  pricings,
  partners,
  articles,
  reviews,
} from './data';

const useStyles = makeStyles(theme => ({
  sectionAlternate: {
    backgroundImage: `linear-gradient(180deg, ${theme.palette.alternate.main} 50%, ${theme.palette.background.paper} 0%)`,
  },
  reviewSection: {
    background: theme.palette.primary.dark,
  },
}));

const CloudHosting = () => {
  const classes = useStyles();

  return (
    <div>
      <Hero />
      <Section>
        <Features data={features} />
      </Section>
      <About />
      <Section>
        <MobileApp data={mobileapp} />
      </Section>
      <SectionAlternate className={classes.sectionAlternate}>
        <HowItWorks data={howItWorks} />
      </SectionAlternate>
      <Storage />
      <SectionAlternate className={classes.sectionAlternate} innerNarrowed>
        <Pricings data={pricings} />
      </SectionAlternate>
      <SectionAlternate>
        <Support />
      </SectionAlternate>
      <Section>
        <Articles data={articles} />
      </Section>
      <SectionAlternate>
        <Story />
      </SectionAlternate>
      <Section>
        <Partners data={partners} />
      </Section>
      <SectionAlternate className={classes.reviewSection} innerNarrowed>
        <Reviews data={reviews} />
      </SectionAlternate>
    </div>
  );
};

export default CloudHosting;
