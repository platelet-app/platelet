import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  colors,
  Typography,
  Divider,
} from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { HeroShaped, Section, CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  appStore: {
    maxWidth: 152,
  },
  googlePlayBtn: {
    border: '1px solid #A6A6A6',
    borderRadius: '5px',
    maxWidth: '150px',
  },
  cover: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
    },
  },
  coverImg: {
    objectFit: 'contain',
  },
  cardBase: {
    borderRadius: '35px',
    border: `2px solid ${colors.blueGrey[50]}`,
    maxWidth: 300,
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(3, 0),
  },
  dot: {
    display: 'block',
    width: theme.spacing(1),
    height: theme.spacing(1),
    borderRadius: '100%',
    background: colors.grey[500],
    marginRight: theme.spacing(1),
    '&:last-child': {
      marginRight: 0,
    },
  },
  dotHighlighted: {
    background: colors.grey[900],
  },
  divider: {
    marginTop: theme.spacing(3),
    width: '100%',
  },
}));

const About = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <HeroShaped
        leftSide={
          <SectionHeader
            title={
              <span>
                Don't listen to what they say{' '}
                <Typography color="secondary" variant="inherit" component="span">go and see</Typography>
              </span>
            }
            subtitle="Travelling with our app is easy. Join the biggest community of travellers."
            ctaGroup={[
              <Image
                src="https://assets.maccarianagency.com/the-front/mobile-addons/app-store.png"
                alt="Get in on App Store"
                className={classes.appStore}
                lazy={false}
              />,
              <Image
                src="https://assets.maccarianagency.com/the-front/mobile-addons/play-store.png"
                alt="Get in on Play Market"
                className={classes.googlePlayBtn}
                lazy={false}
              />,
            ]}
            align="left"
            disableGutter
            data-aos="fade-up"
            titleVariant="h3"
          />
        }
        rightSide={
          <div className={classes.cover}>
            <Image
              src="https://assets.maccarianagency.com/the-front/illustrations/city-driver.svg"
              alt="..."
              className={classes.coverImg}
              data-aos="fade-up"
              lazy={false}
            />
          </div>
        }
      />
      <Section narrow>
        <Grid container spacing={isMd ? 4 : 2}>
          <Grid item xs={12} sm={6} data-aos="fade-up">
            <Grid container alignItems="flex-start" justify="center">
              <CardBase className={classes.cardBase} withShadow liftUp>
                <>
                <Image
                  src="https://assets.maccarianagency.com/the-front/illustrations/travelers.svg"
                  alt="..."
                  lazy={false}
                />
                <div className={classes.dots}>
                  <span className={classes.dot} />
                  <span className={classes.dot} />
                  <span className={clsx(classes.dot, classes.dotHighlighted)} />
                  <span className={classes.dot} />
                </div>
                <Typography variant="h6">TRAVEL TOGETHER</Typography>
                <Divider className={classes.divider} />
                </>
              </CardBase>
            </Grid>
          </Grid>
          <Grid
            item
            container
            alignItems="center"
            xs={12}
            sm={6}
            data-aos="fade-up"
          >
            <SectionHeader
              title={
                <span>
                  <Typography color="secondary" variant="inherit" component="span">Now available</Typography> on
                  Google Play Market and Apple App Store
                </span>
              }
              subtitle="Don't listen to what they say go and see. Travelling with our app is easy. Join the biggest community of travellers."
              ctaGroup={[
                <Image
                  src="https://assets.maccarianagency.com/the-front/mobile-addons/app-store.png"
                  alt="Get in on App Store"
                  className={classes.appStore}
                  lazy={false}
                />,
                <Image
                  src="https://assets.maccarianagency.com/the-front/mobile-addons/play-store.png"
                  alt="Get in on Play Market"
                  className={classes.googlePlayBtn}
                  lazy={false}
                />,
              ]}
              align={isMd ? 'left' : 'center'}
              disableGutter
              titleVariant="h3"
            />
          </Grid>
        </Grid>
      </Section>
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
