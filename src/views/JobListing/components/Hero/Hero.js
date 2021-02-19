import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
} from '@material-ui/core';
import { Image, Icon, IconText } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  hero: {
    backgroundColor: theme.palette.alternate.main,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3, 4),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(5, 8),
    },
  },
  image: {
    maxWidth: 400,
  },
  inputContainer: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      bottom: 0,
      transform: 'translateY(100%)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: '0 !important',
    },
  },
  input: {
    background: theme.palette.background.paper,
    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.11)',
  },
}));

const Hero = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <div className={classes.hero}>
        <Grid
          container
          justify="space-between"
          spacing={isMd ? 4 : 2}
          direction={isMd ? 'row' : 'column-reverse'}
        >
          <Grid
            item
            container
            alignItems="center"
            xs={12}
            md={6}
            data-aos={'fade-up'}
          >
            <SectionHeader
              title="Find the world’s best remote job"
              subtitle="Productivity tools can either help you or get in the way. TheFront aims to remove all barriers between you and just getting stuff done. "
              ctaGroup={[
                <Button variant="contained" color="primary" size="large">
                  Explore
                </Button>,
                <IconText
                  fontIconClass="fas fa-play"
                  color={theme.palette.primary.main}
                  title="Watch a video"
                />,
              ]}
              align="left"
              titleVariant="h3"
            />
            <div className={classes.inputContainer}>
              <FormControl fullWidth variant="outlined" data-aos="fade-up">
                <OutlinedInput
                  className={classes.input}
                  startAdornment={
                    <InputAdornment position="start">
                      <Icon
                        fontIconClass="fas fa-search"
                        fontIconColor={theme.palette.primary.main}
                      />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          </Grid>
          <Grid
            item
            container
            justify="center"
            alignItems="flex-start"
            xs={12}
            md={6}
            data-aos={'fade-up'}
          >
            <Image
              src="https://assets.maccarianagency.com/the-front/illustrations/relax-working.svg"
              alt="Find a Job"
              className={classes.image}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

Hero.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Hero;
