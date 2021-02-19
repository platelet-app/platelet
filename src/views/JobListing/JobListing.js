import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import {
  AboutBottom,
  AboutMiddle,
  AboutTop,
  Advantages,
  Customers,
  Features,
  Hero,
  Jobs,
  Newsletter,
  Partners,
  Process,
  PromoNumbers,
  PromoSwiper,
  Questions,
  TrustedCompanies,
} from './components';

import {
  partners,
  process,
  features,
  jobs,
  advantages,
  companies,
  promo,
  reviews,
} from './data';

const useStyles = makeStyles(theme => ({
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    },
  },
  sectionNoPaddingTop: {
    paddingTop: 0,
  },
  promoSection: {
    background: theme.palette.alternate.main,
    padding: theme.spacing(6, 2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(12, 2),
    },
  },
}));

const JobListing = () => {
  const classes = useStyles();

  return (
    <div>
      <Section className={classes.pagePaddingTop}>
        <Hero />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <Partners data={partners} />
      </Section>
      <SectionAlternate>
        <Questions />
      </SectionAlternate>
      <Section>
        <Process data={process} />
      </Section>
      <SectionAlternate>
        <AboutTop />
      </SectionAlternate>
      <Section>
        <Jobs data={jobs} />
      </Section>
      <SectionAlternate>
        <PromoNumbers />
      </SectionAlternate>
      <AboutMiddle />
      <Section>
        <Features data={features} />
      </Section>
      <section className={classes.promoSection}>
        <PromoSwiper data={promo} />
      </section>
      <Section>
        <Advantages data={advantages} />
      </Section>
      <SectionAlternate>
        <TrustedCompanies data={companies} />
      </SectionAlternate>
      <AboutBottom />
      <Section>
        <Customers data={reviews} />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <Newsletter />
      </Section>
      <Divider />
    </div>
  );
};

export default JobListing;
