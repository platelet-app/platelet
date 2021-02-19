import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Section, SectionAlternate } from 'components/organisms';
import { Breadcrumb, Categories, Questions } from './components';

import { breadcrumb, questions, categories } from './data';

const useStyles = makeStyles(theme => ({
  sectionBreadcrumb: {
    '& .section-alternate__content': {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    },
  },
}));

const HelpCenterArticle = () => {
  const classes = useStyles();

  return (
    <div>
      <SectionAlternate className={classes.sectionBreadcrumb}>
        <Breadcrumb data={breadcrumb} />
      </SectionAlternate>
      <Section className={classes.pagePaddingTop}>
        <Questions data={questions} />
      </Section>
      <SectionAlternate>
        <Categories data={categories} />
      </SectionAlternate>
    </div>
  );
};

export default HelpCenterArticle;
