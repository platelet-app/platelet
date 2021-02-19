import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { useMediaQuery, Grid, Typography, Button } from '@material-ui/core';
import { Icon, LearnMoreLink } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { CardPricingStandard } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  fontWeight900: {
    fontWeight: 900,
  },
}));

const Pricings = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Simple pricing"
        subtitle="A pay-once license, just for you."
        ctaGroup={[
          <LearnMoreLink title="See what's included" href="#" variant="h6" />,
        ]}
        data-aos="fade-up"
      />
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <CardPricingStandard
            variant="outlined"
            withShadow
            liftUp
            title="Extended License"
            subtitle="A pay-once license, just for you"
            priceComponent={
              <div>
                <Typography
                  variant="h3"
                  component="span"
                  className={classes.fontWeight900}
                >
                  $79
                </Typography>
                <Typography component="span" variant="subtitle1">
                  / MO
                </Typography>
              </div>
            }
            features={[
              'Rich, responsive landing pages',
              '100+ styled components',
              'Flexible, simple license',
              'Speedy build tooling',
              '6 months free support included',
            ]}
            featureCheckComponent={
              <Icon
                fontIconClass="far fa-check-circle"
                fontIconColor={theme.palette.primary.main}
              />
            }
            cta={
              <Button
                color="primary"
                variant="contained"
                fullWidth
                size="large"
              >
                Subscribe now
              </Button>
            }
            disclaimer="Fully featured 30-day free trial"
          />
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <CardPricingStandard
            variant="outlined"
            title="Standard License"
            liftUp
            subtitle="A pay-once license, just for you"
            priceComponent={
              <div>
                <Typography
                  variant="h3"
                  component="span"
                  className={classes.fontWeight900}
                >
                  $49
                </Typography>
                <Typography component="span" variant="subtitle1">
                  / MO
                </Typography>
              </div>
            }
            features={[
              'Rich, responsive landing pages',
              '100+ styled components',
              'Flexible, simple license',
              'Speedy build tooling',
              '6 months free support included',
            ]}
            featureCheckComponent={
              <Icon
                fontIconClass="far fa-check-circle"
                fontIconColor={theme.palette.primary.main}
              />
            }
            cta={
              <Button color="primary" variant="outlined" fullWidth size="large">
                Subscribe now
              </Button>
            }
            disclaimer="Fully featured 30-day free trial"
          />
        </Grid>
      </Grid>
    </div>
  );
};

Pricings.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Pricings;
