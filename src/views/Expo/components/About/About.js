import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid, Typography } from '@material-ui/core';
import { HeroSideImage } from 'components/organisms';

const useStyles = makeStyles(() => ({
  fontWeight700: {
    fontWeight: 700,
  },
  textWhite: {
    color: 'white',
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
      {data.map((item, index) => (
        <HeroSideImage
          imageSrc={item.image.src}
          imageSrcSet={item.image.srcSet}
          reverse={index % 2 === 0}
          key={index}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant={isMd ? 'h4' : 'h5'}
                color="primary"
                className={clsx(
                  isMd ? '' : classes.textWhite,
                  classes.fontWeight700,
                )}
              >
                {item.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant={isMd ? 'h6' : 'body1'}
                className={clsx(
                  isMd ? '' : classes.textWhite,
                  classes.fontWeight700,
                )}
              >
                {item.subtitle}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant={isMd ? 'body1' : 'body2'}
                color="textSecondary"
                className={isMd ? '' : classes.textWhite}
              >
                {item.description}
              </Typography>
            </Grid>
          </Grid>
        </HeroSideImage>
      ))}
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
