import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Icon } from 'components/atoms';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    marginLeft: theme.spacing(1),
  },
}));

/**
 * Component to display the icon text
 *
 * @param {Object} props
 */
const IconText = props => {
  const {
    title,
    color,
    fontIconClass,
    className,
    iconProps,
    typographyProps,
    ...rest
  } = props;

  const classes = useStyles();

  return (
    <div className={clsx('icon-text', classes.root, className)} {...rest}>
      <Icon
        className="icon-text__icon"
        size="small"
        fontIconClass={fontIconClass}
        fontIconColor={color}
        {...iconProps}
      />
      <Typography
        noWrap
        variant="subtitle1"
        color="textPrimary"
        className={clsx('icon-text__typography', classes.title)}
        {...typographyProps}
      >
        {title}
      </Typography>
    </div>
  );
};

IconText.defaultProps = {
  iconProps: {},
  typographyProps: {},
};

IconText.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * The classes of the font icon
   */
  fontIconClass: PropTypes.string.isRequired,
  /**
   * Source set for the responsive images
   */
  color: PropTypes.string,
  /**
   * Title of the icon-text
   */
  title: PropTypes.string.isRequired,
  /**
   * Additional properties to pass to the Icon component
   */
  iconProps: PropTypes.object,
  /**
   * Additional properties to pass to the Typography component
   */
  typographyProps: PropTypes.object,
};

export default IconText;
