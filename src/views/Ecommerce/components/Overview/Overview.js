import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.primary.dark,
    borderRadius: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingBottom: 0,
    },
  },
  textWhite: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 22,
  },
  image: {
    objectFit: 'contain',
    maxWidth: '90%',
    width: 300,
  },
  imageLeft: {
    objectFit: 'cover',
  },
  copy: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(0, 2),
  },
}));

const Overview = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Grid container data-aos="fade-up">
        <Grid item container alignItems="flex-start" xs={12} md={4}>
          <Image
            src="https://assets.maccarianagency.com/the-front/photos/ecommerce/overview-cover-left.png"
            srcSet="https://assets.maccarianagency.com/the-front/photos/ecommerce/overview-cover-left@2x.png 2x"
            className={clsx(classes.image, classes.imageLeft)}
            lazy={false}
          />
        </Grid>
        <Grid
          item
          container
          alignItems="center"
          xs={12}
          md={4}
          className={classes.copy}
        >
          <SectionHeader
            title={
              <span className={clsx(classes.textWhite, classes.title)}>
                Fide more products
              </span>
            }
            subtitle={
              <span className={classes.textWhite}>
                If we're no longer the right solution for you, we'll allow you
                to export and take your data at anytime for any reason.
              </span>
            }
            ctaGroup={[
              <Button variant="contained" color="default" size="large">
                Learn more
              </Button>,
            ]}
            align="center"
            disableGutter
          />
        </Grid>
        <Grid item container justify="flex-end" xs={12} md={4}>
          <Image
            src="https://assets.maccarianagency.com/the-front/photos/ecommerce/overview-cover-right.png"
            srcSet="https://assets.maccarianagency.com/the-front/photos/ecommerce/overview-cover-right@2x.png 2x"
            className={classes.image}
            lazy={false}
          />
        </Grid>
      </Grid>
    </div>
  );
};

Overview.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Overview;
