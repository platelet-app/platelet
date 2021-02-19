import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { Grid, Typography } from '@material-ui/core';
import { SectionHeader, CountUpNumber } from 'components/molecules';
import { HeroShaped, Map } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  placementGrid: {
    display: 'flex',
  },
  placementGridItemMiddle: {
    margin: `0 ${theme.spacing(3)}px`,
  },
  map: {
    zIndex: 9,
  },
}));

const MapHero = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <HeroShaped
        leftSide={
          <Grid container spacing={1} data-aos="fade-up">
            <Grid item xs={12}>
              <SectionHeader
                label="locations"
                title={
                  <span>
                    <Typography color="secondary" variant="inherit" component="span">
                      Over 400 locations{' '}
                    </Typography>
                    spread across the entire planet.
                  </span>
                }
                subtitle="We picked our office locations to maximize our availability to you! We try to keep locations in every major city, as well as common vacatino destinations in case you need to sneak work in on the side."
                align="left"
                fadeUp
                disableGutter
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
                  <CountUpNumber
                    end={312}
                    label="Cities"
                    textColor="secondary"
                  />
                </div>
                <div>
                  <CountUpNumber
                    end={40000}
                    label="Desks"
                    textColor="secondary"
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        }
        rightSide={
          <Map
            center={[45.464211, 9.011383]}
            pins={data}
            className={classes.map}
          />
        }
      />
    </div>
  );
};

MapHero.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default MapHero;
