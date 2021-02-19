import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { Grid, Typography, Button } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  promoLogo: {
    maxWidth: 100,
  },
}));

const About = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} data-aos="fade-up" {...rest}>
      <Grid container justify="space-between" spacing={isMd ? 4 : 0}>
        <Grid item xs={12} md={6} data-aos={'fade-up'}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12}>
              <SectionHeader
                title={
                  <span>
                    Guaranted{' '}
                    <Typography component="span" variant="inherit" color="primary">
                      Company Growth
                    </Typography>{' '}
                    with Targeted Leads
                  </span>
                }
                subtitle="We will help you to understand your leads and you will increase your company growth by converting the qualified leads into sales."
                ctaGroup={[
                  <Button
                    variant="contained"
                    color="primary"
                    size={isMd ? 'large' : 'medium'}
                  >
                    Start a Free Trial
                  </Button>,
                  <Button
                    variant="outlined"
                    color="primary"
                    size={isMd ? 'large' : 'medium'}
                  >
                    Learn more
                  </Button>,
                ]}
                align={isMd ? 'left' : 'center'}
                disableGutter
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                color="primary"
                align={isMd ? 'left' : 'center'}
                gutterBottom
              >
                TRUSTED BY:
              </Typography>
              <Grid container justify="space-between">
                {data.map((partner, index) => (
                  <Grid
                    item
                    container
                    justify="center"
                    xs={6}
                    sm={2}
                    key={index}
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      className={classes.promoLogo}
                      lazy={false}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          container
          justify="center"
          xs={12}
          md={6}
          data-aos={'fade-up'}
        >
          <Image
            src="https://assets.maccarianagency.com/the-front/illustrations/dashboard-extended.svg"
            alt="Dashboard"
          />
        </Grid>
      </Grid>
    </div>
  );
};

About.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default About;
