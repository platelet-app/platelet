import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors, Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import {
  About,
  Advantages,
  Contact,
  Description,
  Gallery,
  Hero,
  PromoNumbers,
  Reviews,
  Speakers,
  VideoSection,
} from './components';

import {
  promoNumbers,
  advantages,
  partners,
  webinars,
  reviews,
  gallery,
  teasers,
} from './data';

const useStyles = makeStyles(theme => ({
  sectionDescription: {
    background: colors.blue[900],
  },
  sectionAlternateForm: {
    background: 'transparent',
    backgroundImage: `linear-gradient(180deg, ${theme.palette.background.paper} 300px, ${theme.palette.primary.dark} 0%)`,
  },
}));

const Expo = () => {
  const classes = useStyles();

  return (
    <div>
      <Hero />
      <SectionAlternate className={classes.sectionDescription}>
        <Description />
      </SectionAlternate>
      <Section>
        <PromoNumbers data={promoNumbers} />
      </Section>
      <Divider />
      <Section>
        <Advantages data={advantages} />
      </Section>
      <SectionAlternate>
        <VideoSection data={partners} />
      </SectionAlternate>
      <About data={teasers} />
      <Section narrow>
        <Speakers data={webinars} />
      </Section>
      <Divider />
      <Section>
        <Reviews data={reviews} />
      </Section>
      <Gallery data={gallery} />
      <div className={classes.sectionAlternateForm}>
        <Section narrow>
          <Contact />
        </Section>
      </div>
    </div>
  );
};

export default Expo;
