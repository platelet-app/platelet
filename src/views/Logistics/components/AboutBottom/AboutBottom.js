import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 'bold',
  },
  image: {
    maxWidth: 400,
  },
}));

const AboutBottom = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid
          item
          container
          justify={isMd ? 'flex-start' : 'center'}
          xs={12}
          md={6}
        >
          <Image
            src="https://assets.maccarianagency.com/the-front/photos/logistics/about-cover.png"
            srcSet="https://assets.maccarianagency.com/the-front/photos/logistics/about-cover@2x.png 2x"
            className={classes.image}
          />
        </Grid>
        <Grid item container alignItems="center" xs={12} md={6}>
          <SectionHeader
            title="Monitor and analyze usage patterns."
            subtitle="Keep track of what's happening with your data, change permissions, and run reports against your data anywhere in the world.Keep track of what's happening with your data, change permissions, and run reports against your data anywhere in the world.Keep track of what's happening with your data, change permissions, and run reports against your data anywhere in the world.Keep track of what's happening with your data, change permissions, and run reports against your data anywhere in the world.Keep track of what's happening with your data, change permissions, and run reports against your data anywhere in the world."
            subtitleVariant="body1"
            subtitleColor="textPrimary"
            data-aos="fade-up"
            align="left"
          />
        </Grid>
      </Grid>
    </div>
  );
};

AboutBottom.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default AboutBottom;
