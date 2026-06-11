import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, colors, IconButton } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
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
  categoryIconButton: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
  },
}));

/**
 * Component to display the category link card
 *
 * @param {Object} props
 */
const CardCategoryLink = props => {
  const {
    fontIconClass,
    color,
    title,
    subtitle,
    href,
    align,
    className,
    iconAlternateProps,
    titleProps,
    subtitleProps,
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
      className={clsx('card-category-link', classes.root, className)}
      {...rest}
    >
      <>
      <Grid container spacing={2} className="card-category-link__wrapper">
        <Grid item container justify={justifyGrid} xs={12}>
          <IconAlternate
            fontIconClass={fontIconClass}
            color={color}
            size="medium"
            {...iconAlternateProps}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            align={align}
            className={classes.fontWeight700}
            {...titleProps}
          >
            {title}
          </Typography>
        </Grid>
        {subtitle && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              align={align}
              color="textSecondary"
              {...subtitleProps}
            >
              {subtitle}
            </Typography>
          </Grid>
        )}
      </Grid>
      <a
        href={href}
        className={clsx('card-category-link__item', classes.categoryIconButton)}
      >
        <IconButton className="card-category-link__icon-button">
          <ArrowRightAltIcon
            className="card-category-link__icon"
            style={{ color: color[500] }}
          />
        </IconButton>
      </a>
      </>
    </CardBase>
  );
};

CardCategoryLink.defaultProps = {
  align: 'left',
  href: '#',
  iconAlternateProps: {},
  titleProps: {},
  subtitleProps: {},
};

CardCategoryLink.propTypes = {
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
  href: PropTypes.string.isRequired,
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
};

export default CardCategoryLink;
