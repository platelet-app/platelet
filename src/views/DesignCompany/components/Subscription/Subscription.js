import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Button } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  cardBase: {
    background: theme.palette.secondary.main,
    [theme.breakpoints.up('md')]: {
      background: `url(https://assets.maccarianagency.com/the-front/illustrations/newsletter-bg.svg) no-repeat 150% 50% ${theme.palette.secondary.main}`,
    },
  },
  textWhite: {
    color: 'white',
  },
}));

const Subscription = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <CardBase
        variant="outlined"
        liftUp
        className={classes.cardBase}
        data-aos="fade-up"
      >
        <>
        <Grid container>
          <Grid item xs={12} md={6}>
            <SectionHeader
              title={
                <span className={classes.textWhite}>
                  Subscribe To Our Newsletter
                </span>
              }
              subtitle={
                <span className={classes.textWhite}>
                  Don't lose a chance to be among the firsts to know about our
                  upcoming news and updates.
                </span>
              }
              fadeUp
              align="left"
            />
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} sm={9}>
                <TextField
                  size="small"
                  fullWidth
                  label="Email"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  send
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        </>
      </CardBase>
    </div>
  );
};

Subscription.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Subscription;
