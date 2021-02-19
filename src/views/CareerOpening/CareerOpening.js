import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import { Application, Main, Newsletter } from './components';

import { jobRequirements } from './data';

const useStyles = makeStyles(theme => ({
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    },
  },
}));

const CareerOpening = () => {
  const classes = useStyles();

  return (
    <div>
      <Section className={classes.pagePaddingTop}>
        <Main data={jobRequirements} />
      </Section>
      <SectionAlternate innerNarrowed>
        <Application />
      </SectionAlternate>
      <Section>
        <Newsletter />
      </Section>
      <Divider />
    </div>
  );
};

export default CareerOpening;
