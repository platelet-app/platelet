import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  TextField,
  InputAdornment,
  useMediaQuery,
  Grid,
  Typography,
  Button,
  NoSsr,
  colors,
} from '@material-ui/core';

import { Section, CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  hero: {
    background: theme.palette.alternate.dark,
  },
  heroWrapper: {
    position: 'relative',
  },
  heroImageContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    background:
      'url(https://assets.maccarianagency.com/the-front/photos/people/designer.png) no-repeat right bottom',
    backgroundSize: 'contain',
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  heroGrid: {
    maxWidth: 926,
  },
  searchGrid: {
    zIndex: 3,
  },
  searchGridText: {
    maxWidth: 605,
  },
  textField: {
    width: '100%',
  },
  searchButton: {
    width: '100%',
    height: '100%',
  },
  searchIcon: {
    color: colors.grey[600],
  },
  title: {
    fontWeight: 'bold',
  },
}));

const Hero = () => {
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <section className={classes.hero}>
      <Section className={classes.heroWrapper}>
        <Grid container spacing={isMd ? 6 : 4} className={classes.heroGrid}>
          <Grid item xs={12} className={classes.searchGridText}>
            <Typography
              variant="h2"
              color="textSecondary"
              className={classes.title}
            >
              Find the most exciting startup jobs
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.searchGrid}>
            <CardBase variant="outlined" withShadow liftUp>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Job title or keyword"
                    variant="outlined"
                    className={classes.textField}
                    size={isMd ? 'medium' : 'small'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NoSsr>
                            <i
                              className={clsx(
                                'fas fa-search',
                                classes.searchIcon,
                              )}
                            />
                          </NoSsr>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Location"
                    variant="outlined"
                    className={classes.textField}
                    size={isMd ? 'medium' : 'small'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NoSsr>
                            <i
                              className={clsx(
                                'fas fa-map-marker-alt',
                                classes.searchIcon,
                              )}
                            />
                          </NoSsr>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    className={classes.searchButton}
                    size="large"
                    variant="contained"
                    color="primary"
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </CardBase>
          </Grid>
          <Grid item xs={12} className={classes.searchGridText}>
            <Typography variant="subtitle1" color="textPrimary">
              Please clearly mention our portal when applying to the jobs.
            </Typography>
          </Grid>
        </Grid>
        <div className={classes.heroImageContainer}></div>
      </Section>
    </section>
  );
};

export default Hero;
