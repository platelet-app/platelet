import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  colors,
  Grid,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@material-ui/core';
import { Icon, Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(() => ({
  textWhite: {
    color: 'white',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  formControl: {
    maxWidth: 400,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
    '& .MuiInputBase-root': {
      color: 'white',
    },
    '& .MuiInputAdornment-root i': {
      color: 'white !important',
    },
  },
  image: {
    maxWidth: 400,
  },
}));

const FooterNewsletter = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} container>
          <Image
            src="https://assets.maccarianagency.com/the-front/illustrations/relax-in-sofa.svg"
            className={classes.image}
          />
        </Grid>
        <Grid item xs={12} sm={6} container alignItems="center">
          <div>
            <SectionHeader
              title={
                <span className={classes.textWhite}>
                  Subscribe To Our Newsletter
                </span>
              }
              subtitle={
                <span className={classes.textWhite}>
                  Don't lose a chance to be among the firsts to know about our
                  upcoming news and updates.
                </span>
              }
              fadeUp
              align="left"
            />
            <div className={classes.inputContainer}>
              <FormControl
                fullWidth
                variant="outlined"
                data-aos="fade-up"
                className={classes.formControl}
              >
                <OutlinedInput
                  endAdornment={
                    <InputAdornment position="end">
                      <Icon
                        fontIconClass="fas fa-paper-plane"
                        fontIconColor={colors.indigo[900]}
                      />
                    </InputAdornment>
                  }
                  placeholder="Enter your email"
                />
              </FormControl>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

FooterNewsletter.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default FooterNewsletter;
