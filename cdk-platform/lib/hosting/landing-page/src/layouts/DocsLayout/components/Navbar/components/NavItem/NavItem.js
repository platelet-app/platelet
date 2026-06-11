import React from 'react';
import clsx from 'clsx';
import { parse } from 'query-string';
import PropTypes from 'prop-types';
import { Typography, ListItem, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  item: {
    display: 'flex',
    textTransform: 'none',
    width: '100%',
    color: theme.palette.text.primary,
    '&:hover': {
      background: 'transparent',
      color: theme.palette.primary.main,
    }
  },
  itemActive: {
    color: theme.palette.primary.main,
    '& span': {
      fontWeight: 700,
    },
  },
}));

const getComponentId = () => parse(window.location.search).component || 'introduction';

const NavItem = ({
  className,
  href,
  icon: Icon,
  title,
  id,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <ListItem
      className={clsx(
        classes.item,
        getComponentId() === id ? classes.itemActive : '',
        className,
      )}
      component={'a'}
      href={href}
      {...rest}
    >
      <Typography variant="body2" component="span">{title}</Typography>
    </ListItem>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.string,
};

export default NavItem;