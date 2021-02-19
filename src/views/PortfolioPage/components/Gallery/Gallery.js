import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  GridList,
  GridListTile,
  Typography,
  Button,
} from '@material-ui/core';
import { Image } from 'components/atoms';

const useStyles = makeStyles(theme => ({
  folioItem: {
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    '&:hover': {
      '& .folio__image': {
        transform: 'scale(1.4)',
      },
      '& .folio__info-wrapper': {
        top: 0,
      },
    },
  },
  folioInfoWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: '100%',
    backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 2%, #000000)',
    padding: theme.spacing(4, 2),
    transition: 'top .6s',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
    },
  },
  image: {
    objectFit: 'cover',
    transitionDuration: '.6s',
    transform: 'scale(1.0)',
  },
  folioTitle: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  folioSubtitle: {
    color: 'white',
    textTransform: 'capitalize',
    margin: theme.spacing(1, 0),
  },
}));

const Gallery = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <GridList cellHeight={isMd ? 360 : 260} cols={3} spacing={isMd ? 24 : 8}>
        {data.map((item, index) => (
          <GridListTile key={index} cols={isMd ? item.cols : 3 || 1}>
            <div className={classes.folioItem} key={index}>
              <Image
                src={item.cover}
                alt={item.title}
                className={clsx('folio__image', classes.image)}
                lazyProps={{ width: '100%', height: '100%' }}
              />
              <div
                className={clsx(
                  'folio__info-wrapper',
                  classes.folioInfoWrapper,
                )}
              >
                <div>
                  <Typography variant="h6" className={classes.folioTitle}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className={classes.folioSubtitle}
                  >
                    {item.subtitle}
                  </Typography>
                  <Button variant="contained" color="secondary">
                    View more
                  </Button>
                </div>
              </div>
            </div>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

Gallery.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Gallery;
