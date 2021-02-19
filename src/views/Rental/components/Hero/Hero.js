import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  colors,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
} from '@material-ui/core';
import { Icon } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { Section } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
    minHeight: 400,
    maxHeight: 600,
    background: `url(https://assets.maccarianagency.com/the-front/photos/rental/hero-bg-image.jpg) no-repeat center ${colors.blueGrey[200]}`,
    backgroundSize: 'cover',
  },
  section: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  textWhite: {
    color: 'white',
  },
  searchInputContainer: {
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.11)',
    borderRadius: theme.spacing(1),
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    '& .MuiOutlinedInput-notchedOutline': {
      border: '0 !important',
    },
    '& .MuiInputAdornment-positionStart': {
      marginRight: theme.spacing(2),
    },
    '& .MuiOutlinedInput-adornedStart': {
      paddingLeft: 0,
    },
    '& .MuiOutlinedInput-input': {
      padding: 0,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  searchButton: {
    maxHeight: 45,
    minWidth: 135,
    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto',
    },
  },
}));

const Hero = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Section className={classes.section}>
        <SectionHeader
          title={
            <span className={classes.textWhite}>Let Us Guide You Home</span>
          }
          subtitle={
            <span className={classes.textWhite}>
              Find the house of your dreams
            </span>
          }
          align="left"
          titleVariant="h3"
          data-aos="fade-up"
        />
        <div className={classes.searchInputContainer} data-aos="fade-up">
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              size="large"
              startAdornment={
                <InputAdornment position="start">
                  <Icon
                    fontIconClass="fas fa-search"
                    fontIconColor={theme.palette.primary.dark}
                  />
                </InputAdornment>
              }
              placeholder="Search for the place"
            />
          </FormControl>
          <Button
            color="primary"
            variant="contained"
            size="large"
            className={classes.searchButton}
          >
            Search
          </Button>
        </div>
      </Section>
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
