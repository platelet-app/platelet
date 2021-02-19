import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';
import { Section } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    background: 'url(https://assets.maccarianagency.com/the-front/photos/rental/footer-bg.jpg) no-repeat center',
    backgroundSize: 'cover',
  },
  section: {
    background: theme.palette.primary.dark,
    borderRadius: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      maxWidth: '50%',
      marginLeft: 0,
      padding: theme.spacing(9),
    },
  },
  textWhite: {
    color: 'white',
  },
}));

const FooterHero = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Section>
        <Section className={classes.section}>
          <SectionHeader
            disableGutter
            data-aos="fade-up"
            align="left"
            titleVariant="h3"
            title={
              <span className={classes.textWhite}>Want to Sell Property?</span>
            }
            subtitle={
              <span className={classes.textWhite}>
                Let us create a tailored strategic marketing plan and keep track
                of the selling process.
              </span>
            }
            ctaGroup={[
              <Button variant="contained" size="large">
                get started
              </Button>,
            ]}
          />
        </Section>
      </Section>
    </div>
  );
};

FooterHero.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default FooterHero;
