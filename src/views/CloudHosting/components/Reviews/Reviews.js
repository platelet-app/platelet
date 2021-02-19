import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Swiper from 'swiper';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  textWhite: {
    color: 'white',
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  swiperSlide: {
    width: 'auto',
  },
  swiperWrapper: {
    marginBottom: theme.spacing(7),
  },
  swiperContainer: {
    '& .swiper-pagination-bullet-active': {
      background: 'white',
    },
  },
}));

const Reviews = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  React.useEffect(() => {
    new Swiper('.review-swiper.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 30,
      pagination: {
        el: '.review-swiper.swiper-container .swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
    });
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title={
          <span className={classes.textWhite}>
            Trusted by the world’s most innovative businesses – big and small
          </span>
        }
      />
      <div
        className={clsx(
          'review-swiper',
          'swiper-container',
          classes.swiperContainer,
        )}
      >
        <div className={clsx('swiper-wrapper', classes.swiperWrapper)}>
          {data.map((item, index) => (
            <div
              className={clsx('swiper-slide', classes.swiperSlide)}
              key={index}
            >
              <Typography
                variant="h6"
                align="center"
                component="p"
                className={clsx(classes.textWhite, classes.title)}
              >
                <i>"{item.feedback}"</i>
              </Typography>
              <Typography
                variant="subtitle1"
                align="center"
                component="p"
                className={clsx(classes.textWhite)}
                gutterBottom
              >
                <i>{item.authorName}</i>
              </Typography>
              <Typography
                variant="subtitle1"
                align="center"
                component="p"
                className={clsx(classes.textWhite)}
              >
                <i>{item.authorOccupation}</i>
              </Typography>
            </div>
          ))}
        </div>
        <div className="swiper-pagination" />
      </div>
    </div>
  );
};

Reviews.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Reviews;
