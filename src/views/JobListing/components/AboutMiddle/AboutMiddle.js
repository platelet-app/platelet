import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { Section } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.primary.dark,
    position: 'relative',
  },
  header: {
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      top: '50%',
      right: 0,
      maxWidth: '50%',
      transform: 'translateY(-50%)',
    },
  },
  image: {
    position: 'relative',
    bottom: theme.spacing(-1),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  textWhite: {
    color: 'white',
  },
}));

const AboutMiddle = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Section className={classes.header}>
        <SectionHeader
          title={
            <span className={classes.textWhite}>
              Easily find leads and customers
            </span>
          }
          subtitle={
            <span className={classes.textWhite}>
              Send one-off and automated email, push, and in-app messages to
              people. Create better stories.
            </span>
          }
          ctaGroup={[
            <Button variant="contained" size="large">
              Get started
            </Button>,
          ]}
          align="left"
          disableGutter
          data-aos="fade-up"
        />
      </Section>
      <Image
        src="https://assets.maccarianagency.com/the-front/illustrations/people-in-sofa.svg"
        className={classes.image}
        data-aos="fade-up"
      />
    </div>
  );
};

AboutMiddle.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default AboutMiddle;
