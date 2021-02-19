import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';

import { Section, SectionAlternate } from 'components/organisms';

import {
  Hero,
  Promo,
  Process,
  Categories,
  Info,
  Jobs,
  Placements,
  Companies,
  Application,
  Faq,
} from './components';

import { partners, jobCategories, jobs, companies, faq } from './data';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  sectionAlternate: {
    background: 'transparent',
    backgroundImage: `linear-gradient(180deg, ${theme.palette.background.paper} 400px, ${theme.palette.primary.dark} 0%)`,
  },
}));

const CareerListing = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Hero />
      <SectionAlternate>
        <Promo data={partners} />
      </SectionAlternate>
      <Section>
        <Process />
      </Section>
      <Divider />
      <Section>
        <Categories data={jobCategories} />
      </Section>
      <SectionAlternate>
        <Info />
      </SectionAlternate>
      <Section>
        <Jobs data={jobs} />
      </Section>
      <SectionAlternate>
        <Placements />
      </SectionAlternate>
      <Section>
        <Companies data={companies} />
      </Section>
      <SectionAlternate>
        <Application />
      </SectionAlternate>
      <SectionAlternate innerNarrowed className={classes.sectionAlternate}>
        <Faq data={faq} />
      </SectionAlternate>
    </div>
  );
};

export default CareerListing;
