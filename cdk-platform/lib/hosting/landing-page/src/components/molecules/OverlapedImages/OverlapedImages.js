import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Image } from 'components/atoms';

const useStyles = makeStyles(theme => ({
  imageGrid: {
    padding: '.25rem',
    width: '150%',
    boxShadow: '0 1.5rem 4rem rgba(22,28,45,.1)',
    background: theme.palette.background.paper,
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      verticalAlign: 'middle',
      borderStyle: 'none',
    },
  },
  imageGridFirstItem: {
    marginTop: '4rem',
  },
  imageGridLastItem: {
    marginTop: '6rem',
    float: 'right',
  },
}));

/**
 * Component to display the overlaped images
 *
 * @param {Object} props
 */
const OverlapedImages = props => {
  const { image1, image2, image3, className, ...rest } = props;

  const classes = useStyles();

  return (
    <Grid
      container
      className={clsx('overlaped-images', className)}
      {...rest}
    >
      <Grid item xs={4} className="overlaped-images__item-container">
        <div
          className={clsx(
            'overlaped-images__item-wrapper',
            classes.imageGrid,
            classes.imageGridFirstItem,
          )}
        >
          <Image
            src={image1.src}
            srcSet={image1.srcset}
            alt={image1.alt}
            className="overlaped-images__item-image"
          />
        </div>
      </Grid>
      <Grid item xs={4} className="overlaped-images__item-container">
        <div
          className={clsx('overlaped-images__item-wrapper', classes.imageGrid)}
        >
          <Image
            src={image2.src}
            srcSet={image2.srcset}
            alt={image2.alt}
            className="overlaped-images__item-image"
          />
        </div>
      </Grid>
      <Grid item xs={4} className="overlaped-images__item-container">
        <div
          className={clsx(
            'overlaped-images__item-wrapper',
            classes.imageGrid,
            classes.imageGridLastItem,
          )}
        >
          <Image
            src={image3.src}
            srcSet={image3.srcset}
            alt={image3.alt}
            className="overlaped-images__item-image"
          />
        </div>
      </Grid>
    </Grid>
  );
};

OverlapedImages.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Image item - Object of src, srcset and alt properties
   */
  image1: PropTypes.object.isRequired,
  /**
   * Image item - Object of src, srcset and alt properties
   */
  image2: PropTypes.object.isRequired,
  /**
   * Image item - Object of src, srcset and alt properties
   */
  image3: PropTypes.object.isRequired,
};

export default OverlapedImages;
