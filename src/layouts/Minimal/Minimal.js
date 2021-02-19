import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Topbar } from './components';

const useStyles = makeStyles(() => ({
  root: {
  },
  content: {
    height: '100%',
  },
}));

const Minimal = ({ themeMode, children, className }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <Topbar themeMode={themeMode} />
      <Divider />
      <main className={classes.content}>{children}</main>
    </div>
  );
};

Minimal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  themeMode: PropTypes.string.isRequired,
};

export default Minimal;
