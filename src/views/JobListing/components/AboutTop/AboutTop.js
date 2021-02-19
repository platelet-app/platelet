import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid, Typography } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  image: {
    maxWidth: 400,
  },
}));

const AboutTop = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid container justify="space-between" spacing={isMd ? 4 : 2}>
        <Grid
          item
          container
          justify="center"
          alignItems="flex-start"
          xs={12}
          md={6}
          data-aos={'fade-up'}
        >
          <Image
            src="https://assets.maccarianagency.com/the-front/illustrations/easy-corner.svg"
            alt="Find a Job"
            className={classes.image}
          />
        </Grid>
        <Grid
          item
          container
          alignItems="center"
          xs={12}
          md={6}
          data-aos={'fade-up'}
        >
          <div>
            <SectionHeader
              title="Easily find leads and customers"
              subtitle="Send one-off and automated email, push, and in-app messages to people. Create better stories."
              align="left"
            />
            <Typography align="left" variant="h6" color="textSecondary">
              We get thousands of job postings weekly, but only accept the
              openings at the top companies. We get thousands of job postings
              weekly, but only accept the openings at the top companies.
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

AboutTop.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default AboutTop;
