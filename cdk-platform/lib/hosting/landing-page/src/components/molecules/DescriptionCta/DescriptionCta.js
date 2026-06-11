import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid, Typography } from '@material-ui/core';

/**
 * Component to display the description with CTA's
 *
 * @param {Object} props
 */
const DescriptionCta = props => {
  const {
    title,
    subtitle,
    primaryCta,
    secondaryCta,
    align,
    className,
    wrapperProps,
    titleProps,
    subtitleProps,
    buttonGroupProps,
    primaryButtonWrapperProps,
    secondaryButtonWrapperProps,
    ...rest
  } = props;

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true,
  });

  let justifyGrid = 'center';
  if (align === 'left') {
    justifyGrid = isSm ? 'flex-end' : 'flex-start';
  } else if (align === 'right') {
    justifyGrid = isSm ? 'flex-start' : 'flex-end';
  }

  return (
    <Grid
      container
      spacing={2}
      justify="space-between"
      alignItems="center"
      className={clsx('description-cta', className)}
      {...rest}
    >
      <Grid item className="description-cta__wrapper" {...wrapperProps}>
        <Typography
          variant="h5"
          align={align}
          gutterBottom
          className="description-cta__title"
          {...titleProps}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="subtitle1"
            align={align}
            color="textSecondary"
            className="description-cta__subtitle"
            {...subtitleProps}
          >
            {subtitle}
          </Typography>
        )}
      </Grid>
      <Grid item>
        <Grid
          container
          justify={justifyGrid}
          spacing={1}
          className="description-cta__button-group"
          {...buttonGroupProps}
        >
          <Grid
            item
            className="description-cta__primary-button-wrapper"
            {...primaryButtonWrapperProps}
          >
            {primaryCta}
          </Grid>
          {secondaryCta && (
            <Grid
              item
              className={clsx('description-cta__secondary-button-wrapper')}
              {...secondaryButtonWrapperProps}
            >
              {secondaryCta}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

DescriptionCta.defaultProps = {
  align: 'center',
  wrapperProps: {},
  titleProps: {},
  subtitleProps: {},
  buttonGroupProps: {},
  primaryButtonWrapperProps: {},
  secondaryButtonWrapperProps: {},
};

DescriptionCta.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Title of the list
   */
  title: PropTypes.string.isRequired,
  /**
   * Subtitle of the list
   */
  subtitle: PropTypes.string,
  /**
   * Primary CTA of the list
   */
  primaryCta: PropTypes.node.isRequired,
  /**
   * Secondary CTA of the list
   */
  secondaryCta: PropTypes.node,
  /**
   * Alignment
   */
  align: PropTypes.oneOf(['left', 'right', 'center']),
  /**
   * Additional properties to pass to the wrapper Grid item components
   */
  wrapperProps: PropTypes.object,
  /**
   * Additional properties to pass to the title Typography components
   */
  titleProps: PropTypes.object,
  /**
   * Additional properties to pass to the subtitle Typography components
   */
  subtitleProps: PropTypes.object,
  /**
   * Additional properties to pass to the button group div container
   */
  buttonGroupProps: PropTypes.object,
  /**
   * Additional properties to pass to the primary button wrapper div container
   */
  primaryButtonWrapperProps: PropTypes.object,
  /**
   * Additional properties to pass to the secondary button wrapper div container
   */
  secondaryButtonWrapperProps: PropTypes.object,
};

export default DescriptionCta;
