import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, colors } from '@material-ui/core';
import { IconAlternate } from 'components/molecules';
import { CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  fontWeight700: {
    fontWeight: 700,
  },
}));

/**
 * Component to display the promo card
 *
 * @param {Object} props
 */
const CardPromo = props => {
  const {
    titleColor,
    fontIconClass,
    color,
    title,
    subtitle,
    description,
    align,
    className,
    iconAlternateProps,
    titleProps,
    subtitleProps,
    descriptionProps,
    ...rest
  } = props;

  const classes = useStyles();

  let justifyGrid = 'flex-start';
  if (align === 'center') {
    justifyGrid = 'center';
  } else if (align === 'right') {
    justifyGrid = 'flex-end';
  }
  return (
    <CardBase
      className={clsx('card__promo', classes.root, className)}
      {...rest}
    >
      <Grid container spacing={2} className="card-promo__wrapper">
        <Grid
          item
          container
          justify={justifyGrid}
          xs={12}
          className="card-promo__icon-wrapper"
        >
          <IconAlternate
            fontIconClass={fontIconClass}
            color={color}
            size="medium"
            className="card-promo__icon"
            {...iconAlternateProps}
          />
        </Grid>
        <Grid item xs={12} className="card-promo__title-wrapper">
          <Typography
            variant="h4"
            align={align}
            className={clsx('card-promo__title', classes.fontWeight700)}
            color={titleColor || 'textPrimary'}
            {...titleProps}
          >
            {title}
          </Typography>
        </Grid>
        {subtitle && (
          <Grid item xs={12} className="card-promo__subtitle-wrapper">
            <Typography
              variant="h6"
              align={align}
              className={clsx('card-promo__subtitle', classes.fontWeight700)}
              {...subtitleProps}
            >
              {subtitle}
            </Typography>
          </Grid>
        )}
        {description && (
          <Grid item xs={12} className="card-promo__description-wrapper">
            <Typography
              variant="subtitle1"
              color="textSecondary"
              align={align}
              className="card-promo__description"
              {...descriptionProps}
            >
              {description}
            </Typography>
          </Grid>
        )}
      </Grid>
    </CardBase>
  );
};

CardPromo.defaultProps = {
  align: 'left',
  iconAlternateProps: {},
  titleProps: {},
  subtitleProps: {},
  descriptionProps: {},
};

CardPromo.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Promo title to show inside the card
   */
  title: PropTypes.string.isRequired,
  /**
   * Promo subtitle to show inside the card
   */
  subtitle: PropTypes.string,
  /**
   * Promo description to show inside the card
   */
  description: PropTypes.string,
  /**
   * Promo font icon class name to show inside the card
   */
  fontIconClass: PropTypes.string,
  /**
   * Promo icon color to show inside the card
   */
  color: PropTypes.oneOf([
    colors.red,
    colors.pink,
    colors.purple,
    colors.deepPurple,
    colors.indigo,
    colors.blue,
    colors.lightBlue,
    colors.cyan,
    colors.teal,
    colors.green,
    colors.lightGreen,
    colors.lime,
    colors.yellow,
    colors.amber,
    colors.orange,
    colors.deepOrange,
    colors.brown,
    colors.grey,
    colors.blueGrey,
  ]).isRequired,
  /**
   * The content alignment
   */
  align: PropTypes.oneOf(['left', 'right', 'center']),
  /**
   * Title color
   */
  titleColor: PropTypes.string,
  /**
   * Additional props to pass to the IconAlternate component
   */
  iconAlternateProps: PropTypes.object,
  /**
   * Additional props to pass to the title Typography component
   */
  titleProps: PropTypes.object,
  /**
   * Additional props to pass to the subtitle Typography component
   */
  subtitleProps: PropTypes.object,
  /**
   * Additional props to pass to the desciption Typography component
   */
  descriptionProps: PropTypes.object,
};

export default CardPromo;
