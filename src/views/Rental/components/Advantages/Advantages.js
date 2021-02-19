import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';
import { LearnMoreLink } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  readMoreLink: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(2),
    },
  },
  grid: {
    borderRadius: theme.spacing(1),
    transition:
      'box-shadow .25s ease,transform .25s ease,-webkit-transform .25s ease',
    '&:hover': {
      boxShadow:
        '0 1.5rem 2.5rem rgba(22,28,45,.1),0 .3rem 0.5rem -.50rem rgba(22,28,45,.05) !important',
      transform: 'translate3d(0,-5px,0)',
    },
  },
}));

const Advantages = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid container justify="center" spacing={isMd ? 4 : 2}>
        {data.map((item, index) => (
          <Grid
            item
            container
            direction="column"
            xs={12}
            md={3}
            key={index}
            data-aos="fade-up"
            className={classes.grid}
          >
            <SectionHeader
              titleVariant="h6"
              title={item.title}
              subtitle={item.subtitle}
              subtitleColor="textPrimary"
              subtitleVariant="body1"
              align="left"
              disableGutter
            />
            <div style={{ flexGrow: 1 }} />
            <LearnMoreLink
              title="Learn more"
              variant="subtitle1"
              className={classes.readMoreLink}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Advantages.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Advantages;
