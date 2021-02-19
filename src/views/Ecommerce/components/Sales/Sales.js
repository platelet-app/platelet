import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  image: {
    objectFit: 'contain',
    height: 120,
  },
  fontWeightBold: {
    fontWeight: 'bold',
  },
  cardMedia: {
    padding: theme.spacing(2, 2, 0, 2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const Sales = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="The most sold products"
        subtitle="After 3 days all of your offers will arrive and you will have another 7 days to select your new company."
        subtitleColor="textPrimary"
        subtitleVariant="body1"
        data-aos="fade-up"
        align="left"
      />
      <Grid container spacing={isMd ? 4 : 2}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} data-aos="fade-up">
            <Card>
              <CardMedia className={classes.cardMedia}>
                <Image
                  {...item.image}
                  alt={item.title}
                  className={classes.image}
                />
              </CardMedia>
              <CardContent>
                <Typography
                  color="textPrimary"
                  variant="subtitle1"
                  className={classes.fontWeightBold}
                  align="center"
                >
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Sales.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Sales;
