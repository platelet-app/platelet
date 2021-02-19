import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 700,
  },
}));

/**
 * Component to display the description list with icon
 *
 * @param {Object} props
 */
const DescriptionListIcon = props => {
  const {
    title,
    subtitle,
    icon,
    align,
    titleVariant,
    subtitleVariant,
    className,
    titleProps,
    subtitleProps,
    ...rest
  } = props;

  const classes = useStyles();

  let gridJustify = 'center';

  if (align === 'left') {
    gridJustify = 'flex-start';
  } else if (align === 'right') {
    gridJustify = 'flex-end';
  }

  return (
    <Grid
      container
      spacing={2}
      {...rest}
      className={clsx('description-list-icon', className)}
    >
      <Grid
        item
        container
        justify={gridJustify}
        xs={12}
        className="description-list-icon__icon-wrapper"
      >
        {icon}
      </Grid>
      <Grid item xs={12} className="description-list-icon__title-wrapper">
        <Typography
          variant={titleVariant}
          color="textPrimary"
          align={align}
          className={clsx(classes.title, 'description-list-icon__title')}
          {...titleProps}
        >
          {title}
        </Typography>
      </Grid>
      {subtitle && (
        <Grid item xs={12} className="description-list-icon__subtitle-wrapper">
          <Typography
            variant={subtitleVariant}
            color="textSecondary"
            align={align}
            className="description-list-icon__subtitle"
          >
            {subtitle}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

DescriptionListIcon.defaultProps = {
  align: 'center',
  titleVariant: 'h6',
  subtitleVariant: 'body1',
  titleProps: {},
  subtitleProps: {},
};

DescriptionListIcon.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * The title
   */
  title: PropTypes.string.isRequired,
  /**
   * the subtitle
   */
  subtitle: PropTypes.string,
  /**
   * Whether should show the alternate icon
   */
  icon: PropTypes.node.isRequired,
  /**
   * The alignment of the items
   */
  align: PropTypes.oneOf(['left', 'right', 'center']),
  /**
   * Title variant
   */
  titleVariant: PropTypes.string,
  /**
   * Subtitle variant
   */
  subtitleVariant: PropTypes.string,
  /**
   * Additional props to pass to the title Typography component
   */
  titleProps: PropTypes.object,
  /**
   * Additional props to pass to the subtitle Typography component
   */
  subtitleProps: PropTypes.object,
};

export default DescriptionListIcon;
