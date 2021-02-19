import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Typography, Button, useMediaQuery } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { Section } from 'components/organisms';

const useStyles = makeStyles(() => ({
  root: {
    background: '#0c133e',
  },
  hero: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  section: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  textWhite: {
    color: 'white',
  },
}));

const Storage = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Section className={classes.hero}>
        <Grid container>
          <Grid item xs={12} md={6} data-aos="fade-up">
            <Section className={classes.section}>
              <>
              <Typography
                variant="h6"
                gutterBottom
                className={classes.textWhite}
              >
                ALL IN ONE SOLUTION
              </Typography>
              <SectionHeader
                title={
                  <span className={classes.textWhite}>
                    A one stop shop for storage.
                  </span>
                }
                subtitle={
                  <span className={classes.textWhite}>
                    Forward thinking businesses use our cloud backup service to
                    ensure data reliability and safety. Keep track of what's
                    happening with your data, change permissions, and run
                    reports against your data anywhere in the world.
                  </span>
                }
                ctaGroup={[
                  <Button variant="contained" size="large">
                    Explore
                  </Button>,
                ]}
                align="left"
                data-aos="fade-up"
              />
              </>
            </Section>
          </Grid>
          {isMd ? (
            <Grid item xs={12} md={6}>
              <Image
                src="https://assets.maccarianagency.com/the-front/illustrations/review-list.png"
                srcSet="https://assets.maccarianagency.com/the-front/illustrations/review-list@2x.png 2x"
              />
            </Grid>
          ) : null}
        </Grid>
      </Section>
    </div>
  );
};

Storage.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Storage;
