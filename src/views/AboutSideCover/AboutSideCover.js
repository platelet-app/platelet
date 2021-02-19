import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Image } from 'components/atoms';
import { Section } from 'components/organisms';
import { Contact, Locations, Story, Team } from './components';

import { team } from './data';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  section: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: 0,
    },
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  },
  cover: {
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    background: theme.palette.alternate.dark,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(-8),
      marginRight: theme.spacing(-8),
    },
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '30%',
      maxWidth: 470,
      height: '100%',
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  coverContent: {
    [theme.breakpoints.up('md')]: {
      position: 'sticky',
      top: '50%',
      transform: 'translateY(-50%)',
      padding: theme.spacing(2),
    },
  },
  image: {
    width: '100%',
    maxWidth: 500,
    [theme.breakpoints.up('md')]: {
      maxWidth: '100%',
      width: 'auto',
      height: 'auto',
    },
  },
  content: {
    flex: '0 0 100%',
    maxWidth: '100%',
    [theme.breakpoints.up('md')]: {
      flex: '0 0 70%',
      maxWidth: '70%',
    },
  },
  contentSection: {
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(12),
    },
  },
  pagePaddingTop: {
    paddingTop: 0,
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    },
  },
}));

const AboutSideCover = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Section className={clsx(classes.pagePaddingTop, classes.section)}>
        <div className={classes.wrapper}>
          <div className={classes.cover}>
            <div>
              <div className={classes.coverContent}>
                <SectionHeader
                  title="Discover the world’s top Designers & Creatives."
                  subtitle="We are founded by a leading academic and researcher in the field of Industrial Systems Engineering."
                  align="left"
                  titleVariant="h3"
                />
                <Image
                  src="https://assets.maccarianagency.com/the-front/illustrations/city-driver.svg"
                  alt="Contact"
                  className={classes.image}
                />
              </div>
            </div>
          </div>
          <div className={classes.content}>
            <Story className={classes.contentSection} />
            <Team data={team} className={classes.contentSection} />
            <Locations className={classes.contentSection} />
            <Contact />
          </div>
        </div>
      </Section>
      <Divider />
    </div>
  );
};

export default AboutSideCover;
