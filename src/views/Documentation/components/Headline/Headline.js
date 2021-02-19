import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

const Headline = ({ title, description, path, className, ...rest }) => (
  <div className={className} {...rest}>
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="textSecondary" gutterBottom>
      <code>{path}</code>
    </Typography>
    <Typography variant="h6">
      {description}
    </Typography>
  </div>
);

Headline.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Description
   */
  description: PropTypes.string.isRequired,
  /**
   * Component Path
   */
  path: PropTypes.string.isRequired,
  /**
   * Title
   */
  title: PropTypes.string.isRequired,
};

export default Headline;
