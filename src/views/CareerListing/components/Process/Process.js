import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';

import { SectionHeader, OverlapedImages } from 'components/molecules';

const Process = props => {
  const { data, className, ...rest } = props;

  return (
    <div className={className} {...rest}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={6}>
          <SectionHeader
            label="process"
            title={
              <span>
                <Typography component="span" variant="inherit" color="primary">Our process</Typography>{' '}
                to find you a new job is fast and you can do it from home.
              </span>
            }
            subtitle="We keep everything as simple as possible by standardizing the application process for all jobs."
            align="left"
            disableGutter
          />
        </Grid>
        <Grid
          item
          container
          alignContent="center"
          xs={12}
          sm={12}
          md={6}
          data-aos="fade-up"
        >
          <OverlapedImages
            image1={{
              src: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery1.jpg',
              srcSet: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery1@2x.jpg 2x',
              alt: '...',
            }}
            image2={{
              src: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery2.jpg',
              srcSet: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery2@2x.jpg 2x',
              alt: '...',
            }}
            image3={{
              src: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery3.jpg',
              srcSet: 'https://assets.maccarianagency.com/the-front/photos/expo-gallery/gallery3@2x.jpg 2x',
              alt: '...',
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

Process.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Process;
