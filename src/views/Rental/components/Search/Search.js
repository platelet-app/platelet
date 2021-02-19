import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid, Typography, Button } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { CardBase } from 'components/organisms';

const useStyles = makeStyles(() => ({
  fontWeightBold: {
    fontWeight: 'bold',
  },
}));

const Search = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="What is your real need?"
        subtitle="After 3 days all of your offers will arrive and you will have another 7 days to select your new company."
        align="center"
        data-aos="fade-up"
      />
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <CardBase withShadow liftUp>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={9}>
                <Typography
                  variant="h5"
                  color="textPrimary"
                  gutterBottom
                  className={classes.fontWeightBold}
                  noWrap
                >
                  I share a room
                </Typography>
                <Typography variant="body1" color="textPrimary" noWrap>
                  Over 20,000 users searching a place
                </Typography>
              </Grid>
              <Grid
                item
                container
                justify="flex-end"
                alignItems="center"
                xs={12}
                sm={3}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardBase>
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <CardBase withShadow liftUp>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={9}>
                <Typography
                  variant="h5"
                  color="textPrimary"
                  gutterBottom
                  className={classes.fontWeightBold}
                  noWrap
                >
                  I need a place
                </Typography>
                <Typography variant="body1" color="textPrimary" noWrap>
                  Over 20,000 users searching a place
                </Typography>
              </Grid>
              <Grid
                item
                container
                justify="flex-end"
                alignItems="center"
                xs={12}
                sm={3}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardBase>
        </Grid>
      </Grid>
    </div>
  );
};

Search.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Search;
