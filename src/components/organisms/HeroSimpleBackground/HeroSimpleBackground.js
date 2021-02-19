import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Section } from 'components/organisms';

const useStyles = makeStyles(() => ({
  root: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
}));

const HeroSimpleBackground = props => {
  const {
    children,
    backgroundSize,
    backgroundImage,
    backgroundPosition,
    className,
    ...rest
  } = props;
  const classes = useStyles();

  const useBackground = makeStyles(() => ({
    backgroundImage: {
      backgroundImage: `url(${backgroundImage})`,
    },
    backgroundSize: {
      backgroundSize: backgroundSize,
    },
    backgroundPosition: {
      backgroundPosition: backgroundPosition,
    },
  }));
  const backgroundClasses = useBackground();

  return (
    <div
      className={clsx(
        'hero-simple-background',
        classes.root,
        className,
        backgroundClasses.backgroundImage,
        backgroundClasses.backgroundSize,
        backgroundClasses.backgroundPosition,
      )}
      {...rest}
    >
      <Section className="hero-simple-background__section">{children}</Section>
    </div>
  );
};

HeroSimpleBackground.defaultProps = {
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

HeroSimpleBackground.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * The main content
   */
  children: PropTypes.node.isRequired,
  /**
   * The background image of the hero
   */
  backgroundImage: PropTypes.string.isRequired,
  /**
   * The background size of the hero
   */
  backgroundSize: PropTypes.string,
  /**
   * The background position of the hero
   */
  backgroundPosition: PropTypes.string,
};

export default HeroSimpleBackground;
