import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid, Typography, Button } from '@material-ui/core';
import { HeroBackground } from 'components/organisms';

const useStyles = makeStyles(() => ({
  textWhite: {
    color: 'white',
  },
  title: {
    fontWeight: 'bold',
  },
}));

const Hero = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <HeroBackground backgroundImg="https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery3@2x.jpg">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography
              variant="h3"
              className={clsx(classes.textWhite, classes.title)}
            >
              Join the world's leading companies at TheFront 2020
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" className={classes.textWhite} gutterBottom>
              Whether it’s Porsche, Stripe, Intercom, Amazon, or Google,
              something about TheFront works for our global partners.
            </Typography>
            <Typography variant="h5" className={classes.textWhite}>
              Want more information? Download our overview and a member of our
              specialist team will be in touch to talk about your goals for
              TheFront 2020.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button size={isMd ? 'large' : 'medium'} variant="contained">
              Download exhibitor overview
            </Button>
          </Grid>
        </Grid>
      </HeroBackground>
    </div>
  );
};

Hero.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Hero;
