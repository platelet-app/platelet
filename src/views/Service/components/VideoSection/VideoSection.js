import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { Grid, Button, Typography } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  video: {
    position: 'relative',
  },
  videoCover: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    background: theme.palette.primary.main,
    opacity: '0.3',
    borderRadius: theme.spacing(1),
    cursor: 'pointer',
  },
  videoPlayButton: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: 70,
    zIndex: 1300,
    boxShadow: `0 8px 21px 0 ${theme.palette.cardShadow}`,
    borderRadius: '100%',
  },
}));

const VideoSection = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} data-aos="fade-up" {...rest}>
      <Grid
        container
        justify="space-between"
        spacing={isMd ? 4 : 2}
        direction="row-reverse"
      >
        <Grid item xs={12} md={6} data-aos={'fade-up'}>
          <Grid container alignItems="flex-start">
            <Grid item xs={12}>
              <SectionHeader
                title={
                  <span>
                    Launch Your Website{' '}
                    <Typography component="span" variant="inherit" color="primary">
                      Marketing Platform
                    </Typography>
                  </span>
                }
                subtitle="We help digital agencies, local business and managed service providers to have the best Website Marketing service."
                ctaGroup={[
                  <Button
                    variant="outlined"
                    color="primary"
                    size={isMd ? 'large' : 'medium'}
                  >
                    Launch a video
                  </Button>,
                ]}
                align={isMd ? 'left' : 'center'}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          container
          justify="center"
          xs={12}
          md={6}
          data-aos={'fade-up'}
        >
          <div className={classes.video}>
            <Image src="https://assets.maccarianagency.com/the-front/illustrations/dashboard.svg" alt="Dashboard" />
            <i
              className={clsx(classes.videoPlayButton, 'fas fa-play-circle')}
            />
            <div className={classes.videoCover} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

VideoSection.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default VideoSection;
