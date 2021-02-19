import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, GridList, GridListTile } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  image: {
    objectFit: 'cover',
    borderRadius: theme.spacing(1),
  },
  textWhite: {
    color: 'white',
  },
  gridListTile: {
    position: 'relative',
  },
  gridListSection: {
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

const Places = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Find more places"
        subtitle="After 3 days all of your offers will arrive and you will have another 7 days to select your new company."
        data-aos="fade-up"
      />
      <GridList cellHeight={isMd ? 360 : 260} cols={4} spacing={isMd ? 24 : 8}>
        {data.map((item, index) => (
          <GridListTile
            key={index}
            cols={isMd ? item.cols : 4 || 1}
            className={classes.gridListTile}
          >
            <Image
              {...item.image}
              alt={item.location}
              className={classes.image}
              lazyProps={{
                width: '100%',
                height: '100%',
              }}
            />
            <SectionHeader
              title={<span className={classes.textWhite}>{item.location}</span>}
              subtitle={
                <span className={classes.textWhite}>
                  {item.properties} Properties
                </span>
              }
              disableGutter
              className={classes.gridListSection}
              align="left"
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

Places.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Places;
