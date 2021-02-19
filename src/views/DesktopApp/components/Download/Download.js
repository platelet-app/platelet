import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { CardBase } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  cardBase: {
    background: theme.palette.primary.main,
    [theme.breakpoints.up('md')]: {
      background: `url(https://assets.maccarianagency.com/the-front/illustrations/newsletter-bg.svg) no-repeat 150% 50% ${theme.palette.primary.dark}`,
    },
  },
  textWhite: {
    color: 'white',
  },
  sectionHeader: {
    [theme.breakpoints.up('md')]: {
      maxWidth: '60%',
    },
  },
}));

const Subscription = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <CardBase
        variant="outlined"
        liftUp
        className={classes.cardBase}
        align="left"
        data-aos="fade-up"
      >
        <SectionHeader
          title={
            <span className={classes.textWhite}>
              Get TheFront and save your time.
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
          ctaGroup={[
            <Button variant="contained" size="large">
              Download now
            </Button>,
          ]}
          disableGutter
          className={classes.sectionHeader}
        />
      </CardBase>
    </div>
  );
};

Subscription.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Subscription;
