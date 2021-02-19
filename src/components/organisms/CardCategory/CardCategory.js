import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { CardBase, DescriptionListIcon } from 'components/organisms';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
}));

/**
 * Component to display the category card
 *
 * @param {Object} props
 */
const CardCategory = props => {
  const { icon, title, align, className, ...rest } = props;

  const classes = useStyles();

  return (
    <CardBase className={clsx(classes.root, className)} {...rest}>
      <DescriptionListIcon icon={icon} title={title} align={align} />
    </CardBase>
  );
};

CardCategory.defaultProps = {
  align: 'center',
};

CardCategory.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * Icon to show inside the category card
   */
  icon: PropTypes.node.isRequired,
  /**
   * Category title to show inside the category card
   */
  title: PropTypes.string.isRequired,
  /**
   * The content alignment
   */
  align: PropTypes.oneOf(['left', 'right', 'center']),
};

export default CardCategory;
