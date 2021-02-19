import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Section, SectionAlternate } from 'components/organisms';
import {
  About,
  AboutBottom,
  Features,
  Hero,
  Integrations,
  Jobs,
  News,
  Pricings,
  Reviews,
  Search,
  Team,
  Trucking,
  Video,
} from './components';

import {
  trucking,
  features,
  team,
  integrations,
  reviews,
  jobs,
  news,
  pricings,
} from './data';

const useStyles = makeStyles(theme => ({
  sectionTrucking: {
    maxWidth: '100%',
    paddingRight: 0,
    paddingLeft: 0,
  },
  featuresSection: {
    background: 'url(https://assets.maccarianagency.com/the-front/illustrations/patterns-bg.svg) no-repeat center',
    backgroundSize: 'contain',
  },
  integrationsSection: {
    background: '#0c133e',
  },
  sectionNoPaddingTop: {
    paddingTop: 0,
  },
  reviewSection: {
    background: theme.palette.primary.dark,
  },
  aboutSection: {
    background: '#0c133e',
  },
}));

const Logistics = () => {
  const classes = useStyles();

  return (
    <div>
      <Hero />
      <Section className={classes.sectionTrucking}>
        <Trucking data={trucking} />
      </Section>
      <SectionAlternate className={classes.aboutSection}>
        <About />
      </SectionAlternate>
      <div className={classes.featuresSection}>
        <Section>
          <Features data={features} />
        </Section>
      </div>
      <SectionAlternate>
        <News data={news} />
      </SectionAlternate>
      <Section>
        <Team data={team} />
      </Section>
      <Video />
      <SectionAlternate className={classes.integrationsSection}>
        <Integrations data={integrations} />
      </SectionAlternate>
      <Section>
        <Pricings data={pricings} />
      </Section>
      <SectionAlternate innerNarrowed>
        <Jobs data={jobs} />
      </SectionAlternate>
      <Section>
        <Search />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <AboutBottom />
      </Section>
      <SectionAlternate className={classes.reviewSection}>
        <Reviews data={reviews} />
      </SectionAlternate>
    </div>
  );
};

export default Logistics;
