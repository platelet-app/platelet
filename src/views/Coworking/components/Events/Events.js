import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid, Typography, Button } from '@material-ui/core';
import { Image, IconText, LearnMoreLink } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { CardProduct } from 'components/organisms';

const useStyles = makeStyles(() => ({
  fontWeight700: {
    fontWeight: 700,
  },
  coverImage: {
    objectFit: 'cover',
  },
}));

const Events = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Events in Milan"
        subtitle="Events in our locations and featured events to meet people, share your passions, exchange with your knowledge, learn and grow your network."
        ctaGroup={[
          <Button
            variant="contained"
            size={isMd ? 'large' : 'medium'}
            color="primary"
          >
            Explore our locations
          </Button>,
        ]}
      />
      <Grid container spacing={isMd ? 4 : 2}>
        {data.map((item, index) => (
          <Grid key={index} item xs={12} md={4} data-aos={'fade-up'}>
            <CardProduct
              withShadow
              liftUp
              mediaContent={
                <Image
                  className={classes.coverImage}
                  {...item.cover}
                  alt={item.title}
                  lazyProps={{
                    width: '100%',
                    height: '100%',
                  }}
                />
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
                  <Grid
                    item
                    container
                    alignItems="center"
                    wrap="nowrap"
                    xs={12}
                  >
                    <IconText
                      size="small"
                      fontIconClass="far fa-clock"
                      color={theme.palette.primary.main}
                      title={item.time}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      noWrap
                      variant="body1"
                      color="primary"
                      className={classes.fontWeight700}
                    >
                      {item.place}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <LearnMoreLink title={'Learn more'} variant="body1" />
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

Events.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Events;
