import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import {
  Categories,
  Courses,
  Hero,
  PromoNumbers,
  Reviews,
  Subscription,
} from './components';

import {
  promoNumbers,
  courseCategories,
  popularCourses,
  reviews,
} from './data';

const useStyles = makeStyles(theme => ({
  coursesSection: {
    maxWidth: 800,
    margin: '0 auto',
  },
  paddingBottom0: {
    paddingBottom: 0,
  },
  sectionAlternate: {
    background: 'transparent',
    backgroundImage: `linear-gradient(180deg, ${theme.palette.background.paper} 40%, ${theme.palette.primary.dark} 0%)`,
  },
}));

const Elearning = () => {
  const classes = useStyles();

  return (
    <div>
      <Hero />
      <Section>
        <PromoNumbers data={promoNumbers} />
      </Section>
      <SectionAlternate>
        <>
        <Categories data={courseCategories} />
        <Section>
          <Divider />
        </Section>
        <Courses data={popularCourses} className={classes.coursesSection} />
        </>
      </SectionAlternate>
      <Section className={classes.paddingBottom0}>
        <Reviews data={reviews} />
      </Section>
      <SectionAlternate innerNarrowed className={classes.sectionAlternate}>
        <Subscription />
      </SectionAlternate>
    </div>
  );
};

export default Elearning;
