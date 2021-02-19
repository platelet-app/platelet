import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, useMediaQuery, colors } from '@material-ui/core';
import { LearnMoreLink } from 'components/atoms';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(theme => ({
  gridItemBorder: {
    [theme.breakpoints.up('md')]: {
      borderRight: `1px solid ${colors.grey[200]}`,
    },
  },
}));

const Support = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <div className={className} {...rest}>
      <Grid container spacing={isMd ? 4 : 2}>
        <Grid item xs={12} sm={6} className={classes.gridItemBorder}>
          <SectionHeader
            title="Need a Support?"
            titleVariant="h5"
            subtitle="View message performance and test against variants and control."
            subtitleVariant="body1"
            subtitleColor="textPrimary"
            ctaGroup={[<LearnMoreLink title="Open a ticket" />]}
            disableGutter
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <SectionHeader
            title="Customize Plan"
            titleVariant="h5"
            subtitle="Looking for something else? Request a Consultation to customize a plan."
            subtitleVariant="body1"
            subtitleColor="textPrimary"
            ctaGroup={[<LearnMoreLink title="Contact us" />]}
            disableGutter
          />
        </Grid>
      </Grid>
    </div>
  );
};

Support.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Support;
