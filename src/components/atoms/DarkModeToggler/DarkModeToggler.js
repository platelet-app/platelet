import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, colors } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  border: {
    width: theme.spacing(5),
    height: theme.spacing(2),
    borderRadius: theme.spacing(3),
    border: '3px solid',
    borderColor: theme.palette.divider,
    backgroundColor: 'transparent',
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(6),
      height: theme.spacing(3),
    }
  },
  borderDark: {
    borderColor: colors.indigo[700],
  },
  modeToggler: {
    position: 'absolute',
    top: `-${theme.spacing(1/2)}px`,
    left: `-${theme.spacing(1/2)}px`,
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '50%',
    backgroundColor: theme.palette.text.primary,
    transition: `transform .3s cubic-bezier(.4,.03,0,1)`,
    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    }
  },
  modeTogglerDark: {
    transform: `translateX(${theme.spacing(3)}px)`,
    backgroundColor: colors.indigo[900],
  },
  modeTogglerIcon: {
    fill: theme.palette.secondary.main,
    marginTop: theme.spacing(1/2),
    marginLeft: theme.spacing(1/2),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
    }
  },
}));

/**
 * Component to display the dark mode toggler
 *
 * @param {Object} props
 */
const DarkModeToggler = ({ themeMode = 'light', onClick, className, ...rest }) => {
  const classes = useStyles();

  return (
    <span className={clsx(classes.root, className)} {...rest} onClick={onClick}>
      <div
        className={clsx(
          classes.border,
          themeMode === 'dark' ? classes.borderDark : '',
        )}
      />
      <div
        className={clsx(
          classes.modeToggler,
          themeMode === 'dark' ? classes.modeTogglerDark : '',
        )}>
        <svg
          className={classes.modeTogglerIcon}
          aria-hidden="true"
          width="14"
          height="13"
          viewBox="0 0 14 13"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.52208 7.71754C7.5782 7.71754 10.0557 5.24006 10.0557 2.18394C10.0557 1.93498 10.0392 1.68986 10.0074 1.44961C9.95801 1.07727 10.3495 0.771159 10.6474 0.99992C12.1153 2.12716 13.0615 3.89999 13.0615 5.89383C13.0615 9.29958 10.3006 12.0605 6.89485 12.0605C3.95334 12.0605 1.49286 10.001 0.876728 7.24527C0.794841 6.87902 1.23668 6.65289 1.55321 6.85451C2.41106 7.40095 3.4296 7.71754 4.52208 7.71754Z" />
        </svg>
      </div>
    </span>
  );
};

DarkModeToggler.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * The theme mode
   */
  themeMode: PropTypes.string,
  /**
   * Theme toggler function
   */
  onClick: PropTypes.func.isRequired,
};

export default DarkModeToggler;
