import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  textWhite: {
    color: 'white',
  },
  title: {
    fontWeight: 'bold',
  },
}));

const Description = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            className={clsx(classes.textWhite, classes.title)}
          >
            Milan: the city of rising IT engineering
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" component="p" className={classes.textWhite}>
            Milan is Italy's financial and industrial capital, as well one of
            the world's leading cities of creative field. Having an important
            business history and being the largest Italian industrial center,
            Milan is definitely an attractive destination, with a big business
            opportunities, for tech companies
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

Description.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Description;
