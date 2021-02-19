import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, GridList, GridListTile } from '@material-ui/core';

import { Image } from 'components/atoms';

const useStyles = makeStyles(() => ({
  image: {
    objectFit: 'cover',
  },
}));

const Gallery = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <GridList cellHeight={isMd ? 300 : 100} cols={4} spacing={0}>
        {data.map((item, index) => (
          <GridListTile key={index} cols={item.cols || 1}>
            <Image
              {...item.image}
              alt={item.title}
              lazyProps={{ width: '100%', height: '100%' }}
              className={classes.image}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

Gallery.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Gallery;
