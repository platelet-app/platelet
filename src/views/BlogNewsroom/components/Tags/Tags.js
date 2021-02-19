import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tag: {
    padding: theme.spacing(1 / 2, 1),
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(1),
    background: 'transparent',
    margin: theme.spacing(0, 1, 1, 0),
    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0, 2, 2, 0),
      padding: theme.spacing(1, 2),
    },
    '&:hover': {
      color: 'white',
      background: theme.palette.primary.main,
    },
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(3),
    },
  },
}));

const Tags = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <Typography
        variant="h6"
        color="textPrimary"
        gutterBottom
        className={classes.sectionTitle}
      >
        Tag cloud
      </Typography>
      <div className={classes.tags}>
        {data.map((item, index) => (
          <Typography
            variant="body2"
            color="primary"
            className={classes.tag}
            key={index}
          >
            {item}
          </Typography>
        ))}
      </div>
    </div>
  );
};

Tags.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Tags;
