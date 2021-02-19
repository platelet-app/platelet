import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import {
  Browsers,
  Features,
  Integrations,
  Partners,
  Solutions,
  Subscription,
  VideoSection,
  Webinars,
} from './components';

import {
  partners,
  features,
  browsers,
  advantages,
  webinars,
  platforms,
} from './data';

const useStyles = makeStyles(theme => ({
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    },
  },
  sectionAlternate: {
    background: 'transparent',
    backgroundImage: `linear-gradient(180deg, ${theme.palette.background.paper} 40%, ${theme.palette.primary.dark} 0%)`,
  },
}));

const Enterprise = () => {
  const classes = useStyles();

  return (
    <div>
      <Section className={classes.pagePaddingTop}>
        <VideoSection />
      </Section>
      <Divider />
      <Section narrow>
        <Partners data={partners} />
      </Section>
      <SectionAlternate>
        <Solutions data={features} />
      </SectionAlternate>
      <Section>
        <>
        <Browsers data={browsers} />
        <Section>
          <Divider />
        </Section>
        <Features data={advantages} />
        </>
      </Section>
      <SectionAlternate innerNarrowed>
        <Webinars data={webinars} />
      </SectionAlternate>
      <Section>
        <Integrations data={platforms} />
      </Section>
      <SectionAlternate innerNarrowed className={classes.sectionAlternate}>
        <Subscription />
      </SectionAlternate>
    </div>
  );
};

export default Enterprise;
