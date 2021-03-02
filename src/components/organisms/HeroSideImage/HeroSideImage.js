import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {colors, Grid, useMediaQuery} from '@material-ui/core';
import { Image } from 'components/atoms';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  imageWrapper: {
    position: 'relative',
    maxHeight: 600,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    paddingLeft: 150
  },
  cover: {
    background: colors.indigo[900],
    opacity: 0.0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'absolute',
    padding: theme.spacing(2),
    top: '50%',
    transform: 'translateY(-50%)',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      transform: 'none',
      padding: theme.spacing(0, 4),
    },
  },
}));

/**
 * Component to display the side image hero
 *
 * @param {Object} props
 */
const HeroSideImage = props => {
  const {
    imageSrc,
    imageSrcSet,
    children,
    backgroundColor,
    reverse,
    className,
    ...rest
  } = props;
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const classes = useStyles();

  const useCustomStyles = makeStyles(() => ({
    coverBg: {
      background: backgroundColor,
    },
  }));

  const customClasses = useCustomStyles();

  return (
    <Grid
      container
      className={clsx('hero-side-image', classes.root, className)}
      direction={!isMd ? 'column' : reverse ? 'row-reverse' : 'row'}
      {...rest}
    >
      <Grid
        item
        xs={12}
        md={6}
        className={clsx('hero-side-image__image-wrapper', classes.imageWrapper)}
      >
        <Image
          src={imageSrc}
          srcSet={imageSrcSet ? imageSrcSet : ''}
          alt={'...'}
          className={clsx('hero-side-image__image', classes.image)}
          lazy={false}
        />
        <div
          className={clsx(
            'hero-side-image__cover',
            classes.cover,
            backgroundColor ? customClasses.coverBg : {},
          )}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        className={clsx('hero-side-image__content', classes.content)}
      >
        {children}
      </Grid>
    </Grid>
  );
};

HeroSideImage.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Children to placed inside the hero
   */
  children: PropTypes.node,
  /**
   * Background color of the hero
   */
  backgroundColor: PropTypes.string,
  /**
   * Side image
   */
  imageSrc: PropTypes.string.isRequired,
  /**
   * Side image srcset
   */
  imageSrcSet: PropTypes.string,
  /**
   * Should show in reverse order
   */
  reverse: PropTypes.bool,
};

export default HeroSideImage;
