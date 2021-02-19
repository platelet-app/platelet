import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  image: {
    maxWidth: 390,
    height: 'auto',
    position: 'absolute',
    bottom: '-164px',
    right: 0,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
}));

const FeaturedProducts = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container justify="space-between">
        <Grid item xs={12} sm={6} data-aos={'fade-up'}>
          <SectionHeader
            title="Experience your music like never before."
            subtitle="If we're no longer the right solution for you, we'll allow you to export and take your data at anytime for any reason."
            subtitleColor="textPrimary"
            ctaGroup={[
              <Button variant="contained" color="default" size="large">
                Buy now
              </Button>,
            ]}
            align="left"
            data-aos="fade-up"
            disableGutter
          />
        </Grid>
      </Grid>
      <Image
        src="https://assets.maccarianagency.com/the-front/photos/ecommerce/headphone-cover.png"
        srcSet="https://assets.maccarianagency.com/the-front/photos/ecommerce/headphone-cover@2x.png 2x"
        alt="Headphones"
        className={classes.image}
        data-aos={'fade-up'}
      />
    </div>
  );
};

FeaturedProducts.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default FeaturedProducts;
