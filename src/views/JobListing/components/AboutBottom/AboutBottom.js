import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { Section } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center right',
    [theme.breakpoints.up('md')]: {
      backgroundImage: 'url(https://assets.maccarianagency.com/the-front/illustrations/bg-remote-working.svg)',
    },
  },
  textWhite: {
    color: 'white',
  },
  sectionHeader: {
    [theme.breakpoints.up('md')]: {
      maxWidth: '50%',
    },
  },
}));

const AboutBottom = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Section>
        <SectionHeader
          title={<span className={classes.textWhite}>Remote work</span>}
          subtitle={
            <span className={classes.textWhite}>
              Let us create a tailored strategic marketing plan and keep track
              of the selling process.
            </span>
          }
          ctaGroup={[
            <Button variant="contained" size="large">
              Get started
            </Button>,
          ]}
          align="left"
          className={classes.sectionHeader}
          disableGutter
          data-aos="fade-up"
        />
      </Section>
    </div>
  );
};

AboutBottom.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default AboutBottom;
