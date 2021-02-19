import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import CountUp from 'react-countup';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

/**
 * Component to display the Count Up Numbers
 *
 * @param {Object} props
 */
const CountUpNumber = props => {
  const {
    start,
    end,
    suffix,
    prefix,
    label,
    textColor,
    labelColor,
    className,
    visibilitySensorProps,
    wrapperProps,
    countWrapperProps,
    countNumberProps,
    labelProps,
    ...rest
  } = props;

  const [viewPortEntered, setViewPortEntered] = React.useState(false);
  const setViewPortVisibility = isVisible => {
    if (viewPortEntered) {
      return;
    }

    setViewPortEntered(isVisible);
  };

  return (
    <div className={clsx('countup-number', className)} {...rest}>
      <VisibilitySensor
        onChange={isVisible => setViewPortVisibility(isVisible)}
        delayedCall
        {...visibilitySensorProps}
      >
        <div className="countup-number__wrapper" {...wrapperProps}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            color={textColor || 'textPrimary'}
            className="countup-number__count-wrapper"
            {...countWrapperProps}
          >
            <CountUp
              delay={1}
              redraw={false}
              end={viewPortEntered ? end : start}
              start={start}
              suffix={suffix || ''}
              prefix={prefix || ''}
              className="countup-number__count"
              {...countNumberProps}
            />
          </Typography>
          <Typography
            variant="subtitle1"
            color={labelColor || 'textSecondary'}
            align="center"
            className="countup-number__label"
            {...labelProps}
          >
            {label}
          </Typography>
        </div>
      </VisibilitySensor>
    </div>
  );
};

CountUpNumber.defaultProps = {
  start: 0,
  visibilitySensorProps: {},
  wrapperProps: {},
  countWrapperProps: {},
  countNumberProps: {},
  labelProps: {},
};

CountUpNumber.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * The Suffix of the count up number
   */
  suffix: PropTypes.string,
  /**
   * The Prefix of the count up number
   */
  prefix: PropTypes.string,
  /**
   * The label text of the count up number
   */
  label: PropTypes.string.isRequired,
  /**
   * Starting number
   */
  start: PropTypes.number,
  /**
   * End number
   */
  end: PropTypes.number.isRequired,
  /**
   * Text color
   */
  textColor: PropTypes.string,
  /**
   * Label color
   */
  labelColor: PropTypes.string,
  /**
   * Additional properties to pass to the VisibilitySensor Component
   */
  visibilitySensorProps: PropTypes.object,
  /**
   * Additional properties to pass to the wrapper div
   */
  wrapperProps: PropTypes.object,
  /**
   * Additional properties to pass to the count wrapper Typography component
   */
  countWrapperProps: PropTypes.object,
  /**
   * Additional properties to pass to the CountUp React component
   */
  countNumberProps: PropTypes.object,
  /**
   * Additional properties to pass to the label Typography component
   */
  labelProps: PropTypes.object,
};

export default CountUpNumber;
