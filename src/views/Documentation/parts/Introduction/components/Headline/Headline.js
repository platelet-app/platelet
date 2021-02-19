import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Button } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

const useStyles = makeStyles(() => ({
  fontWeightBold: {
    fontWeight: 'bold',
  },
}));

const Headline = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Introduction"
        subtitle="Material-UI & ReactJS based Landing Pages Kit made with Material UI's components, React. It supports create-react-app build-tools (react-scripts), NextJS, GatsbyJS and Typescript to boost your app development process! A professional React Kit that comes with plenty of ready-to-use Material-UI components that will help you to build faster & beautiful fontend pages. Each component is fully customizable, responsive and easy to integrate."
        align="left"
        titleProps={{
          className: classes.fontWeightBold,
          color: 'textPrimary',
        }}
        subtitleProps={{
          color: 'textPrimary',
          variant: 'body1',
        }}
        ctaGroup={[
          <Button variant="outlined" component="a" href="/">
            Launch a live demo
          </Button>
        ]}
        disableGutter
      />
    </div>
  );
};

Headline.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Headline;
