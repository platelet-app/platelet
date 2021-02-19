import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  Button,
  useMediaQuery,
  colors,
} from '@material-ui/core';
import { Icon } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { CardPricingStandard } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  cardSmall: {
    height: 'auto',
    '& .MuiCardContent-root': {
      padding: theme.spacing(2),
    },
  },
  textCenter: {
    textAlign: 'center',
  },
  fontWeight900: {
    fontWeight: 900,
  },
}));

const Pricings = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Choose your plan"
        label="Pricing"
        data-aos="fade-up"
      />
      <Grid container spacing={isMd ? 0 : 2}>
        {data.map((item, index) => (
          <Grid
            item
            container
            alignItems="center"
            xs={12}
            md={6}
            data-aos="fade-up"
            key={index}
          >
            <CardPricingStandard
              variant="outlined"
              withShadow={item.isHighlighted ? true : false}
              title={item.title}
              liftUp
              priceComponent={
                <div className={classes.textCenter}>
                  <Typography
                    variant="h3"
                    component="span"
                    className={classes.fontWeight900}
                    color="primary"
                  >
                    {item.price}
                  </Typography>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="primary"
                  >
                    {item.priceSuffix}
                  </Typography>
                </div>
              }
              features={item.features}
              featureCheckComponent={
                <Icon
                  fontIconClass="far fa-check-circle"
                  fontIconColor={colors.green[500]}
                />
              }
              cta={
                <Button
                  color={item.isHighlighted ? 'default' : 'primary'}
                  variant="contained"
                  fullWidth
                  size="large"
                >
                  Subscribe now
                </Button>
              }
              disclaimer={item.disclaimer}
              className={!item.isHighlighted ? classes.cardSmall : ''}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

Pricings.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Pricings;
