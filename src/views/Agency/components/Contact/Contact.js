import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { SectionHeader } from 'components/molecules';

const Contact = props => {
  const { className, ...rest } = props;

  return (
    <div className={clsx('jarallax', className)} {...rest}>
      <SectionHeader
        title="Have a project to discuss?"
        subtitle="We work on everything from physical products to digital experiences and are looking forward to hearing from you."
        ctaGroup={[
          <Button variant="contained" color="primary" size="large">
            Contact us
          </Button>,
        ]}
        data-aos="fade-up"
      />
    </div>
  );
};

Contact.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Contact;
