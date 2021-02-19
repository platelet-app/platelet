import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  card: {
    borderRadius: theme.spacing(2),
  },
  cardMedia: {
    height: 290,
    padding: theme.spacing(3, 3, 0, 3),
    position: 'relative',
  },
  cardContent: {
    padding: theme.spacing(3),
  },
  image: {
    objectFit: 'contain',
  },
  fontWeightBold: {
    fontWeight: 'bold',
  },
  priceCta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(1, 0),
  },
  gridItem: {
    '& .latest-products__card-media': {
      background: theme.palette.secondary.main,
    },
    '&:nth-child(2n)': {
      '& .latest-products__card-media': {
        background: theme.palette.primary.main,
      },
    },
  },
}));

const LatestProducts = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="The latest products"
        subtitle="After 3 days all of your offers will arrive and you will have another 7 days to select your new company."
        subtitleColor="textPrimary"
        subtitleVariant="body1"
        data-aos="fade-up"
        align="left"
      />
      <Grid container spacing={2}>
        {data.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={index}
            data-aos="fade-up"
            className={classes.gridItem}
          >
            <Card
              className={clsx(classes.card, 'latest-products__card')}
              variant="outlined"
            >
              <CardMedia
                className={clsx(
                  classes.cardMedia,
                  'latest-products__card-media',
                )}
              >
                <Image
                  {...item.image}
                  alt={item.title}
                  className={classes.image}
                  lazyProps={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </CardMedia>
              <CardContent className={classes.cardContent}>
                <Typography
                  color="textPrimary"
                  variant="subtitle1"
                  className={classes.fontWeightBold}
                >
                  {item.title}
                </Typography>
                <div className={classes.priceCta}>
                  <Typography
                    color="primary"
                    variant="h6"
                    className={classes.fontWeightBold}
                  >
                    {item.price}
                  </Typography>
                </div>
                <div style={{ flexGrow: 1 }} />
                <Button variant="contained" color="primary">
                  Add to card
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

LatestProducts.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default LatestProducts;
