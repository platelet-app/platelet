import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Swiper from 'swiper';
import { Icon } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { CardReview } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  textWhite: {
    color: 'white',
  },
  swiperContainer: {
    position: 'relative',
  },
  swiperNav: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 120,
    float: 'right',
    '& .swiper-button-prev, & .swiper-button-next': {
      width: theme.spacing(6),
      height: theme.spacing(6),
      padding: theme.spacing(3),
      background: theme.palette.background.paper,
      borderRadius: '100%',
      position: 'relative',
      boxShadow: `0 2px 10px 0 ${theme.palette.cardShadow}`,
      border: `2px solid ${theme.palette.background.paper}`,
      '&:after': {
        fontSize: 'initial',
        color: theme.palette.text.primary,
      },
    },
    '& .swiper-button-prev': {
      left: 0,
    },
    '& .swiper-button-next': {
      right: 0,
    },
  },
}));

const Reviews = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  React.useEffect(() => {
    new Swiper('.swiper-container', {
      slidesPerView: 1,
      navigation: {
        nextEl: '.swiper-container .swiper-button-next',
        prevEl: '.swiper-container .swiper-button-prev',
      },
    });
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title={
          <span className={classes.textWhite}>
            Take a look what our customers say
          </span>
        }
        subtitle={
          <span className={classes.textWhite}>
            Take a quick glance at some of our past projects. If you would like
            to see some more great work, get in touch with us to take a look at
            our private portfolio.
          </span>
        }
        align="left"
        data-aos="fade-up"
      />
      <div
        className={clsx('swiper-container', classes.swiperContainer)}
        data-aos="fade-up"
      >
        <div className="swiper-wrapper">
          {data.map((item, index) => (
            <CardReview
              key={index}
              className={'swiper-slide'}
              noBorder
              noShadow
              text={item.feedback}
              icon={<Icon size="large" fontIconClass="fas fa-quote-right" />}
              authorName={item.authorName}
              authorTitle={item.authorOccupation}
              authorPhoto={item.authorPhoto}
              align="left"
              noBg
              textVariant="h4"
            />
          ))}
        </div>
        <div className={classes.swiperNav}>
          <div className={clsx('swiper-button-prev')} />
          <div className={clsx('swiper-button-next')} />
        </div>
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
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Reviews;
