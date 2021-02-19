import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import {
  Contact,
  Features,
  Hero,
  Partners,
  Process,
  Reviews,
  Work,
} from './components';

import { partners, services, process, work, reviews } from './data';

const useStyles = makeStyles(theme => ({
  sectionAlternate: {
    background: 'transparent',
    backgroundImage: `linear-gradient(180deg, ${theme.palette.background.paper} 400px, ${theme.palette.primary.dark} 0%)`,
  },
}));

const Startup = () => {
  const classes = useStyles();

  return (
    <div>
      <Hero />
      <Partners data={partners} />
      <Section>
        <Features data={services} />
      </Section>
      <Divider />
      <Section narrow>
        <Process data={process} />
      </Section>
      <Divider />
      <Section>
        <Work data={work} />
      </Section>
      <Divider />
      <Section>
        <Reviews data={reviews} />
      </Section>
      <Divider />
      <SectionAlternate className={classes.sectionAlternate}>
        <Contact />
      </SectionAlternate>
    </div>
  );
};

export default Startup;
