import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  title: {
    fontWeight: 'bold',
  },
  icon: {
    padding: 0,
    marginLeft: theme.spacing(1),
    '&:hover': {
      background: 'transparent',
    },
  },
}));

/**
 * Component to display the "Learn More" link
 *
 * @param {Object} props
 */
const LearnMoreLink = props => {
  const {
    color,
    component,
    variant,
    title,
    href,
    className,
    iconProps,
    typographyProps,
    ...rest
  } = props;

  const classes = useStyles();

  const children = (
    <>
      <Typography
        component="span"
        className={clsx('learn-more-link__typography', classes.title)}
        variant={variant}
        color={color || 'primary'}
        {...typographyProps}
      >
        {title}
      </Typography>
      <IconButton
        className={clsx('learn-more-link__icon-button', classes.icon)}
        color={color || 'primary'}
        {...iconProps}
      >
        <ArrowRightAltIcon className="learn-more-link__arrow" />
      </IconButton>
    </>
  );

  return (
    <a
      href={href}
      className={clsx('learn-more-link', classes.root, className)}
      {...rest}
    >
      {children}
    </a>
  );
};

LearnMoreLink.defaultProps = {
  variant: 'subtitle1',
  href: '#',
  typographyProps: {},
  iconProps: {},
  component: 'a',
};

LearnMoreLink.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * The component to load as a main DOM
   */
  component: PropTypes.oneOf(['Link', 'a']),
  /**
   * Title of the link
   */
  title: PropTypes.string.isRequired,
  /**
   * Variant of the link
   */
  variant: PropTypes.oneOf(['h6', 'subtitle1', 'subtitle2', 'body1', 'body2']),
  /**
   * Href of the link
   */
  href: PropTypes.string,
  /**
   * Color of the link
   */
  color: PropTypes.string,
  /**
   * Additional properties to pass to the Icon component
   */
  iconProps: PropTypes.object,
  /**
   * Additional properties to pass to the Typography component
   */
  typographyProps: PropTypes.object,
};

export default LearnMoreLink;
