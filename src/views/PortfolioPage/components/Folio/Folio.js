import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import { Image } from 'components/atoms';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(-2),
      marginLeft: theme.spacing(-2),
    },
  },
  folioItem: {
    position: 'relative',
    overflow: 'hidden',
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
    '&:hover': {
      '& .folio__image': {
        transform: 'scale(1.2)',
      },
    },
  },
  image: {
    transitionDuration: '.7s',
    transform: 'scale(1.0)',
    minHeight: 400,
    objectFit: 'cover',
    [theme.breakpoints.up('md')]: {
      minHeight: 600,
    },
  },
  folioInfoWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 2%, #000000)',
    padding: theme.spacing(4, 2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
    },
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
  grid: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  leftGrid: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(1),
      marginBottom: 0,
    },
  },
  rightGrid: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(1),
    },
  },
}));

const Folio = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const leftGridData = data.slice(0, 2);
  const rightGridData = data.slice(2);

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <div className={classes.grid}>
        <div className={classes.leftGrid}>
          {leftGridData.map((item, index) => (
            <div className={classes.folioItem} key={index} data-aos="fade-up">
              <Image
                src={item.cover}
                alt={item.title}
                className={clsx('folio__image', classes.image)}
                lazy={false}
              />
              <div className={classes.folioInfoWrapper}>
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
                  <Button variant="outlined" color="secondary">
                    View more
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={classes.rightGrid}>
          {rightGridData.map((item, index) => (
            <div className={classes.folioItem} key={index} data-aos="fade-up">
              <Image
                src={item.cover}
                alt={item.title}
                className={clsx('folio__image', classes.image)}
                lazy={false}
              />
              <div className={classes.folioInfoWrapper}>
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
                  <Button variant="outlined" color="secondary">
                    View more
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Folio.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Folio;
