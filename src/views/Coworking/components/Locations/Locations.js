import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Typography,
  Button,
  colors,
  Avatar,
  NoSsr,
} from '@material-ui/core';
import { LearnMoreLink } from 'components/atoms';
import { SectionHeader, SwiperImage } from 'components/molecules';
import { CardProduct } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  swiperNavButton: {
    width: `${theme.spacing(3)}px !important`,
    height: `${theme.spacing(3)}px !important`,
    padding: `${theme.spacing(2)}px !important`,
  },
  locationCardPrice: {
    padding: theme.spacing(1),
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    zIndex: 3,
  },
  fontWeight700: {
    fontWeight: 700,
  },
  locationCardReviewAvatar: {
    marginLeft: theme.spacing(-2),
    border: `3px solid ${theme.palette.background.paper}`,
    '&:first-child': {
      marginLeft: 0,
    },
  },
  locationCardReviewStar: {
    color: colors.yellow[800],
    marginRight: theme.spacing(1 / 2),
  },
  reviewCount: {
    marginLeft: theme.spacing(1),
  },
  image: {
    borderBottomLeftRadius: '40%',
  },
}));

const Location = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title={
          <span>
            We are reimagining renting to help you{' '}
            <Typography component="span" variant="inherit" color="primary">
              achieve your dreams
            </Typography>
          </span>
        }
        subtitle="Our mission is to help you grow your business, meet and connect with people who share your passions. We help you fulfill your best potential through an engaging lifestyle experience."
        ctaGroup={[
          <Button
            variant="contained"
            size={isMd ? 'large' : 'medium'}
            color="primary"
          >
            Explore our locations
          </Button>,
        ]}
        fadeUp
      />
      <Grid container spacing={2}>
        {data.map((item, index) => (
          <Grid key={index} item xs={12} sm={12} md={4} data-aos="fade-up">
            <CardProduct
              withShadow
              liftUp
              mediaContent={
                <>
                  <SwiperImage
                    navigationButtonStyle={classes.swiperNavButton}
                    items={item.images}
                    imageClassName={classes.image}
                  />
                  <div className={classes.locationCardPrice}>
                    <Typography
                      variant="body1"
                      color="primary"
                      className={classes.fontWeight700}
                    >
                      {item.price}
                    </Typography>
                  </div>
                </>
              }
              cardContent={
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      color="textPrimary"
                      align="left"
                      className={classes.fontWeight700}
                    >
                      {item.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="left"
                    >
                      {item.address}
                    </Typography>
                  </Grid>
                  <Grid item container justify="space-between" xs={12}>
                    <Grid item container xs={6} wrap="nowrap">
                      {item.reviews.map((review, index) => (
                        <Avatar
                          key={index}
                          className={classes.locationCardReviewAvatar}
                          alt={review.authorName}
                          {...review.authorPhoto}
                        />
                      ))}
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justify="flex-end"
                      xs={6}
                    >
                      <NoSsr>
                        <i
                          className={clsx(
                            'fas fa-star',
                            classes.locationCardReviewStar,
                          )}
                        />
                      </NoSsr>
                      <Typography
                        component="span"
                        variant="body1"
                        className={classes.fontWeight700}
                      >
                        {item.score}
                      </Typography>
                      <Typography
                        noWrap
                        component="span"
                        variant="body2"
                        color="textSecondary"
                        className={classes.reviewCount}
                      >
                        ({item.reviewCount} reviews)
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item container justify="flex-end" xs={12}>
                    <LearnMoreLink title="Learn more" />
                  </Grid>
                </Grid>
              }
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Location.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Location;
