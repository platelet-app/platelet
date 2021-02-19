import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { Grid } from '@material-ui/core';
import { Icon } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { CardBase, DescriptionListIcon } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  featureCardFirstItem: {
    background: theme.palette.secondary.main,
    '& h3, & h6': {
      color: 'white',
    },
  },
  featureIcon: {
    fontSize: 120,
    marginBottom: theme.spacing(2),
  },
  featureCard: {
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      minHeight: 550,
    },
  },
  featureCardSecondItem: {
    border: `2px solid ${theme.palette.text.primary}`,
    marginTop: 0,
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(30),
    },
  },
}));

const Features = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <SectionHeader
        data-aos="fade-up"
        title="We love to explore new ways to engage with brands and reach"
        subtitle="Our mission is to help you to grow your design skills, meet and connect with professional dsigners who share your passions."
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <CardBase
            noShadow
            liftUp
            className={clsx(classes.featureCard, classes.featureCardFirstItem)}
          >
            <DescriptionListIcon
              title="Supercharge your design skills"
              subtitle="Connect in spaces designed to bring incredible people together. Learn with them and take your project to new heights."
              icon={
                <Icon
                  fontIconClass="fas fa-pen-nib"
                  size="large"
                  fontIconColor={'white'}
                  className={classes.featureIcon}
                />
              }
              titleVariant="h3"
              subtitleVariant="h6"
            />
          </CardBase>
        </Grid>
        <Grid item xs={12} md={6} data-aos="fade-up">
          <CardBase
            noShadow
            liftUp
            className={clsx(classes.featureCard, classes.featureCardSecondItem)}
          >
            <DescriptionListIcon
              title="Gain new skiils"
              subtitle="Connect in spaces designed to bring incredible people together. Learn with them and take your project to new heights."
              icon={
                <Icon
                  fontIconClass="fas fa-layer-group"
                  size="large"
                  fontIconColor={'textPrimary'}
                  className={classes.featureIcon}
                />
              }
              titleVariant="h3"
              subtitleVariant="h6"
            />
          </CardBase>
        </Grid>
      </Grid>
    </div>
  );
};

Features.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Features;
