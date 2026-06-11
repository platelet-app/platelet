import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Avatar } from '@material-ui/core';
import { CardBase } from 'components/organisms';
import { LearnMoreLink } from 'components/atoms';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
  companyAvatar: {
    width: 60,
    height: 60,
  },
  dot: {
    display: 'inline-block',
    width: theme.spacing(1),
    height: theme.spacing(1),
    background: theme.palette.text.primary,
    borderRadius: '100%',
    marginRight: theme.spacing(1),
  },
  dotSmall: {
    width: theme.spacing(1 / 2),
    height: theme.spacing(1 / 2),
  },
  companyName: {
    fontWeight: 700,
  },
  dotMargin: {
    margin: theme.spacing(0, 1),
  },
}));

/**
 * Component to display the job card company
 *
 * @param {Object} props
 */
const CardJobCompany = props => {
  const {
    jobTitle,
    jobLocation,
    companyLogo,
    companyName,
    jobsCount,
    companyInfo,
    className,
    ...rest
  } = props;

  const classes = useStyles();

  return (
    <CardBase
      className={clsx('card-company', classes.root, className)}
      align="left"
      {...rest}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Avatar
            src={companyLogo}
            alt={companyName}
            className={classes.companyAvatar}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.companyName}>
            {companyName}
          </Typography>
        </Grid>
        <Grid item container alignItems="center" xs={12}>
          <Typography component="span" variant="subtitle1" color="textPrimary">
            {jobTitle}
          </Typography>
          <span
            className={clsx(classes.dot, classes.dotSmall, classes.dotMargin)}
          />
          <Typography component="span" variant="subtitle1" color="textPrimary">
            {jobLocation}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <LearnMoreLink title={jobsCount} variant="subtitle1" />
        </Grid>
        <Grid item xs={12}>
          <Typography component="p" variant="body2" color="textSecondary">
            {companyInfo}
          </Typography>
        </Grid>
      </Grid>
    </CardBase>
  );
};

CardJobCompany.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Job title of the card
   */
  jobTitle: PropTypes.string.isRequired,
  /**
   * Job location of the card
   */
  jobLocation: PropTypes.string.isRequired,
  /**
   * Company logo of the card
   */
  companyLogo: PropTypes.string.isRequired,
  /**
   * Company name of the card
   */
  companyName: PropTypes.string.isRequired,
  /**
   * Count of the jobs in the the card
   */
  jobsCount: PropTypes.string.isRequired,
  /**
   * Company info in the card
   */
  companyInfo: PropTypes.string.isRequired,
};

export default CardJobCompany;
