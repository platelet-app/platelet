import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(() => ({
  image: {
    maxWidth: 500,
  },
}));

const Teaser = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid container justify="space-between" spacing={isMd ? 4 : 2}>
        <Grid
          item
          container
          alignItems="center"
          xs={12}
          md={6}
          data-aos={'fade-up'}
        >
          <div>
            <SectionHeader
              title="Don't worry about pricing."
              subtitle="Three products that can be used independently or combined together for your company’s needs.Three products that can be used independently or combined together for your company’s needs."
              align="left"
              titleVariant="h3"
              disableGutter
            />
          </div>
        </Grid>
        <Grid
          item
          container
          justify="center"
          alignItems="flex-start"
          xs={12}
          md={6}
          data-aos={'fade-up'}
        >
          <Image
            src="https://assets.maccarianagency.com/the-front/illustrations/relax-in-sofa.svg"
            alt="Features"
            className={classes.image}
          />
        </Grid>
      </Grid>
    </div>
  );
};

Teaser.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Teaser;
