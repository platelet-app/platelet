import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, useMediaQuery, Typography } from '@material-ui/core';
import { SectionHeader, CountUpNumber } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  placementGrid: {
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'center',
    },
  },
  placementGridItemMiddle: {
    margin: `0 ${theme.spacing(3)}px`,
  },
}));

const Locations = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid container spacing={1} data-aos="fade-up">
        <Grid item xs={12}>
          <SectionHeader
            label="locations"
            title={
              <span>
                <Typography color="secondary" variant="inherit" component="span">Over 400 locations </Typography>
                spread across the entire planet.
              </span>
            }
            subtitle="We picked our office locations to maximize our availability to you! We try to keep locations in every major city, as well as common vacatino destinations in case you need to sneak work in on the side."
            fadeUp
            disableGutter
            align={isMd ? 'center' : 'left'}
          />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.placementGrid}>
            <div>
              <CountUpNumber
                end={125}
                label="Countries"
                textColor="secondary"
              />
            </div>
            <div className={classes.placementGridItemMiddle}>
              <CountUpNumber end={312} label="Cities" textColor="secondary" />
            </div>
            <div>
              <CountUpNumber end={40000} label="Desks" textColor="secondary" />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

Locations.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Locations;
