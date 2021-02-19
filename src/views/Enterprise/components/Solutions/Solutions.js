import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { Grid, Button, Typography } from '@material-ui/core';

import { Image, LearnMoreLink } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  listGrid: {
    overflow: 'hidden',
    marginBottom: theme.spacing(3),
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
}));

const Solutions = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title={
          <span>
            Your New Website Marketing{' '}
            <Typography component="span" variant="inherit" color="primary">Solution Is Here</Typography>
          </span>
        }
        subtitle="TheFront Kit offers a completely customizable website landing pages and supported pages management platform. Here’s what makes us different:"
        fadeUp
      />
      <Grid container justify="center">
        {data.map((item, index) => (
          <Grid
            key={index}
            item
            container
            spacing={isMd ? 4 : 2}
            data-aos={'fade-up'}
            alignItems="center"
            justify="space-between"
            direction={index % 2 === 1 ? 'row-reverse' : 'row'}
            className={classes.listGrid}
          >
            <Grid item xs={12} sm={6}>
              <SectionHeader
                label={item.label}
                titleVariant="h5"
                title={item.title}
                subtitle={item.description}
                ctaGroup={[<LearnMoreLink title="Learn more" variant="h6" />]}
                align="left"
                disableGutter
              />
            </Grid>
            <Grid item container justify="center" xs={12} sm={6}>
              <Image
                src={item.illustration}
                alt={item.label}
              />
            </Grid>
          </Grid>
        ))}
        <Grid item container justify="center" xs={12}>
          <Button
            variant="contained"
            color="primary"
            size={isMd ? 'large' : 'medium'}
          >
            See all features
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

Solutions.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Solutions;
