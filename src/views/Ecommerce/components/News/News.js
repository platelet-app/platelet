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
    maxWidth: '100%',
  },
  gridListSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(2),
    background: '#0000007a',
  },
}));

const News = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Our latest news"
        subtitle="After 3 days all of your offers will arrive and you will have another 7 days to select your new company."
        data-aos="fade-up"
      />
      <GridList cellHeight={isMd ? 360 : 260} cols={3} spacing={isMd ? 24 : 8}>
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
            <div className={classes.gridListSection}>
              <SectionHeader
                title={<span className={classes.textWhite}>{item.title}</span>}
                subtitle={
                  <span className={classes.textWhite}>
                    {item.subtitle} Properties
                  </span>
                }
                disableGutter
                align="left"
                titleVariant="h6"
                subtitleVariant="body1"
              />
            </div>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

News.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default News;
