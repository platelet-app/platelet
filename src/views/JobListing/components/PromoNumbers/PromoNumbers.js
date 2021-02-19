import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader, CountUpNumber } from 'components/molecules';
import { CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  placementGrid: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  placementGridItemMiddle: {
    margin: `0 ${theme.spacing(3)}px`,
  },
  image: {
    maxWidth: 400,
  },
}));

const PromoNumbers = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <CardBase withShadow liftUp>
        <Grid container spacing={2}>
          <Grid
            item
            container
            justify="center"
            alignItems="center"
            xs={12}
            md={2}
          >
            <Image
              src="https://assets.maccarianagency.com/the-front/illustrations/high.svg"
              className={classes.image}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <SectionHeader
              title="Hiring? Candidates are working for you"
              data-aos="fade-up"
            />
            <div className={classes.placementGrid} data-aos="fade-up">
              <div>
                <CountUpNumber
                  end={14000}
                  suffix="+"
                  label="Newsletter"
                  textColor="primary"
                  labelColor="textPrimary"
                />
              </div>
              <div className={classes.placementGridItemMiddle}>
                <CountUpNumber
                  end={3000}
                  label="Jobs"
                  textColor="primary"
                  labelColor="textPrimary"
                />
              </div>
              <div>
                <CountUpNumber
                  end={3000}
                  label="Avarage"
                  textColor="primary"
                  labelColor="textPrimary"
                />
              </div>
            </div>
          </Grid>
          <Grid
            item
            container
            alignItems="flex-end"
            justify="center"
            xs={12}
            md={2}
            data-aos="fade-up"
          >
            <Button color="primary" variant="contained" fullWidth size="large">
              Post a job
            </Button>
          </Grid>
        </Grid>
      </CardBase>
    </div>
  );
};

PromoNumbers.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default PromoNumbers;
