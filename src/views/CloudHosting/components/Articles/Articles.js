import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Swiper from 'swiper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  articleDate: {
    margin: theme.spacing(2, 0),
  },
  card: {
    boxShadow: 'none',
    border: 0,
    maxWidth: 300,
  },
  cardMedia: {
    height: 185,
  },
  swiperSlide: {
    width: 'auto',
  },
}));

const Articles = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  React.useEffect(() => {
    new Swiper('.article-swiper.swiper-container', {
      slidesPerView: 'auto',
      spaceBetween: isMd ? 30 : 12,
      pagination: {
        el: '.article-swiper.swiper-container .swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
    });
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        label="Read our articles"
        title="Marketing strategies"
        align="left"
      />
      <div className="article-swiper swiper-container">
        <div className="swiper-wrapper">
          {data.map((item, index) => (
            <div
              className={clsx('swiper-slide', classes.swiperSlide)}
              key={index}
            >
              <Card className={classes.card}>
                <CardMedia className={classes.cardMedia}>
                  <Image
                    {...item.cover}
                    lazyProps={{ width: '100%', height: '100%' }}
                  />
                </CardMedia>
                <CardContent>
                  <Typography
                    variant="body1"
                    color="primary"
                    component="p"
                    className={classes.articleDate}
                  >
                    <i>{item.author}</i>&nbsp;|&nbsp;
                    <i>{item.date}</i>
                  </Typography>
                  <Typography variant="h6" color="textPrimary" component="p">
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <div className="swiper-pagination" />
      </div>
    </div>
  );
};

Articles.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Articles;
