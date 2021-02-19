import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  promoLogo: {
    maxWidth: 120,
  },
  title: {
    fontWeight: 'bold',
  },
}));

const Partners = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} md={6}>
          <SectionHeader
            title="Trusted by Millions of People"
            subtitle="We are registered as a distributor with AMFI, as an investment advisor with SEBI and platform partners with BSE."
            fadeUp
            disableGutter
            align={isMd ? 'left' : 'center'}
            titleProps={{
              className: classes.title,
            }}
          />
        </Grid>
        <Grid item container xs={12} md={6}>
          {data.map((partner, index) => (
            <Grid
              item
              container
              justify="center"
              alignItems="center"
              xs={4}
              key={index}
              data-aos="fade-up"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                className={classes.promoLogo}
                lazy={false}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

Partners.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default Partners;
