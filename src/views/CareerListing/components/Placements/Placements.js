import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import { SectionHeader, CountUpNumber } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 500,
  },
  placementGrid: {
    display: 'flex',
    marginTop: theme.spacing(3),
  },
  placementGridItemMiddle: {
    margin: `0 ${theme.spacing(3)}px`,
  },
}));

const Placements = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <Grid container spacing={1} data-aos="fade-up">
        <Grid item xs={12}>
          <SectionHeader
            label="PLACEMENT RATES"
            title={
              <span>
                <Typography component="span" variant="inherit" color="primary">
                  TheFront is the leading job placement site
                </Typography>{' '}
                with the highest rate of success of any tech job board.
              </span>
            }
            subtitle="We keep everything as simple as possible by standardizing the application process for all jobs."
            align="left"
            disableGutter
            titleClasses={classes.title}
          />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.placementGrid}>
            <div>
              <CountUpNumber
                end={112}
                suffix="K"
                label="Placement"
                textColor="primary"
              />
            </div>
            <div className={classes.placementGridItemMiddle}>
              <CountUpNumber
                end={120}
                suffix="K"
                label="Positions"
                textColor="primary"
              />
            </div>
            <div>
              <CountUpNumber
                end={168}
                suffix="K"
                label="Partners"
                textColor="primary"
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

Placements.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Placements;
