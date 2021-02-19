import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { SectionHeader, OverlapedImages } from 'components/molecules';

const Spaces = props => {
  const { className, ...rest } = props;

  return (
    <div className={className} {...rest}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <SectionHeader
            label="SCALABLE"
            title={
              <span>
                <Typography color="secondary" variant="inherit" component="span">Flexible office space </Typography>
                means growing your team is easy.
              </span>
            }
            subtitle="Rather than worrying about switching offices every couple years, you can instead stay in the same location and grow-up from your shared coworking space to an office that takes up an entire floor."
            align="left"
            fadeUp
            disableGutter
          />
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <OverlapedImages
            image1={{
              src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place1.jpg',
              srcSet: 'https://assets.maccarianagency.com/the-front/photos/coworking/place1@2x.jpg 2x',
              alt: '...',
            }}
            image2={{
              src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place2.jpg',
              srcSet: 'https://assets.maccarianagency.com/the-front/photos/coworking/place2@2x.jpg 2x',
              alt: '...',
            }}
            image3={{
              src: 'https://assets.maccarianagency.com/the-front/photos/coworking/place3.jpg',
              srcSet: 'https://assets.maccarianagency.com/the-front/photos/coworking/place3@2x.jpg 2x',
              alt: '...',
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

Spaces.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Spaces;
