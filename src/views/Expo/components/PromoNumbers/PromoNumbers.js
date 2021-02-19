import React from 'react';
import PropTypes from 'prop-types';
import { SwiperNumber } from 'components/molecules';

const PromoNumbers = props => {
  const { data, className, ...rest } = props;

  return (
    <div className={className} {...rest}>
      <SwiperNumber items={data} />
    </div>
  );
};

PromoNumbers.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default PromoNumbers;
