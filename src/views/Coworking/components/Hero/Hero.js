import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { useMediaQuery, Button, Typography } from '@material-ui/core';
import { SectionHeader, SwiperImage } from 'components/molecules';
import { HeroShaped } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  swiperNavButton: {
    width: `${theme.spacing(3)}px !important`,
    height: `${theme.spacing(3)}px !important`,
    padding: `${theme.spacing(2)}px !important`,
  },
}));

const Hero = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <HeroShaped
        leftSide={
          <SectionHeader
            title={
              <span>
                Coworking made{' '}
                <Typography component="span" variant="inherit" color="primary">easy</Typography>
              </span>
            }
            subtitle="For entrepreneurs, startups and freelancers. Discover coworking spaces designed to inspire and to connect you to a community of motivated people."
            ctaGroup={[
              <Button
                variant="contained"
                color="primary"
                size={isMd ? 'large' : 'medium'}
              >
                Book
              </Button>,
              <Button
                variant="outlined"
                color="primary"
                size={isMd ? 'large' : 'medium'}
              >
                Browse
              </Button>,
            ]}
            align="left"
            titleVariant="h3"
          />
        }
        rightSide={
          <SwiperImage
            navigationButtonStyle={classes.swiperNavButton}
            items={[
              {
                src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place2.jpg',
                srcSet: 'https://assets.maccarianagency.com/the-front/photos/coworking/place2@2x.jpg 2x',
                alt: '...',
              },
              {
                src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place1.jpg',
                srcSet: 'https://assets.maccarianagency.com/the-front/photos/coworking/place1@2x.jpg 2x',
                alt: '...',
              },
              {
                src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place3.jpg',
                srcSet: 'https://assets.maccarianagency.com/the-front/photos/coworking/place3@2x.jpg 2x',
                alt: '...',
              },
            ]}
          />
        }
      />
    </div>
  );
};

Hero.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Hero;
