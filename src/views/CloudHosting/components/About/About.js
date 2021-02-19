import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { Section, CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.alternate.main,
    backgroundSize: 'cover',
    padding: theme.spacing(6, 0),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(12, 0),
    },
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    minHeight: 470,
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  section: {
    paddingTop: 0,
  },
  sectionHeader: {
    padding: theme.spacing(0, 2),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      maxWidth: '50%',
      width: 'calc(100vw - 625px)',
      marginBottom: 0,
    },
  },
  textWhite: {
    color: 'white',
  },
  image: {
    alignSelf: 'flex-end',
    maxWidth: 625,
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      top: '50%',
      right: 0,
      width: 'auto',
      transform: 'translateY(-50%) !important',
    },
  },
  card: {
    borderBottom: `4px solid ${theme.palette.secondary.main}`,
    '& .MuiCardContent-root': {
      padding: 30,
    },
  },
  cardTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(2),
  },
}));

const About = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <div className={classes.hero}>
        <Section className={classes.section} disablePadding>
          <div className={classes.sectionHeader}>
            <Typography variant="h6" gutterBottom color="textPrimary">
              COMPLETE CONTROL
            </Typography>
            <SectionHeader
              title="Monitor and analyze usage patterns."
              subtitle="Keep track of what's happening with your data, change permissions, and run reports against your data anywhere in the world. Keep track of what's happening with your data, change permissions, and run reports against your data anywhere in the world."
              subtitleColor="textPrimary"
              align="left"
              data-aos="fade-up"
            />
            <CardBase withShadow liftUp align="left" className={classes.card}>
              <>
              <Typography className={classes.cardTitle} variant="h6">
                American Standards And European Culture How To Avoid A
                Disappointing Vacation Experience While Traveling In Europe
              </Typography>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemAvatar>
                    <Avatar
                      src="https://assets.maccarianagency.com/the-front/photos/people/jack-smith.jpg"
                      srcSet="https://assets.maccarianagency.com/the-front/photos/people/jack-smith@2x.jpg 2x"
                      alt="Jack Smith"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Jack Smith"
                    secondary="Creative Director at Johnson"
                  />
                </ListItem>
              </List>
              </>
            </CardBase>
          </div>
        </Section>
        <Image
          src="https://assets.maccarianagency.com/the-front/illustrations/macbook-dashboard.png"
          className={classes.image}
          data-aos="fade-up"
          lazy={false}
        />
      </div>
    </div>
  );
};

About.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default About;
