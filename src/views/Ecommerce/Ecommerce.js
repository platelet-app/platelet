import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Section, SectionAlternate } from 'components/organisms';
import {
  Categories,
  FeaturedProducts,
  Hero,
  LatestProducts,
  News,
  Newsletter,
  Overview,
  Products,
  QuickSearch,
  Reviews,
  Sales,
} from './components';

import {
  categories,
  featuredProducts,
  mostSoldProducts,
  news,
  latestProducts,
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
  sectionFeaturedProducts: {
    background: theme.palette.secondary.main,
  },
  reviewSection: {
    background: theme.palette.primary.dark,
  },
}));

const Ecommerce = () => {
  const classes = useStyles();

  return (
    <div>
      <Section className={classes.pagePaddingTop}>
        <Hero />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <Overview />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <Categories data={categories} />
      </Section>
      <SectionAlternate
        className={clsx(
          classes.sectionNoPaddingTop,
          classes.sectionFeaturedProducts,
        )}
      >
        <FeaturedProducts />
      </SectionAlternate>
      <Section>
        <Products data={featuredProducts} />
      </Section>
      <SectionAlternate>
        <Sales data={mostSoldProducts} />
      </SectionAlternate>
      <Section>
        <News data={news} />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <LatestProducts data={latestProducts} />
      </Section>
      <Section className={classes.sectionNoPaddingTop}>
        <QuickSearch />
      </Section>
      <SectionAlternate className={classes.reviewSection}>
        <Reviews data={reviews} />
      </SectionAlternate>
      <Section>
        <Newsletter />
      </Section>
    </div>
  );
};

export default Ecommerce;
