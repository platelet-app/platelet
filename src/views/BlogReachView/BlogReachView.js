import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';
import {
  Hero,
  Horizontal,
  HorizontalCover,
  HorizontalTransparent,
  Vertical,
  VerticalOverlaped,
  VerticalTransparent,
} from './components';

import { articles1, articles2, articles3 } from './data';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
    },
  },
}));

const BlogReachView = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Section className={classes.pagePaddingTop}>
        <Hero />
      </Section>
      <SectionAlternate>
        <>
        <HorizontalCover data={articles1} />
        <Section>
          <Divider />
        </Section>
        <Horizontal data={articles2} />
        <Section>
          <Divider />
        </Section>
        <HorizontalTransparent data={articles1} />
        <Section>
          <Divider />
        </Section>
        <Vertical data={articles3} />
        <Section>
          <Divider />
        </Section>
        <VerticalOverlaped data={articles1} />
        <Section>
          <Divider />
        </Section>
        <VerticalTransparent data={articles3} />
        </>
      </SectionAlternate>
    </div>
  );
};

export default BlogReachView;
