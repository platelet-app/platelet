import React from 'react';
import PropTypes from 'prop-types';
import { CardBase, ContactForm } from 'components/organisms';

const Contact = props => {
  const { className, ...rest } = props;

  return (
    <div className={className} {...rest}>
      <CardBase withShadow data-aos="fade-up">
        <ContactForm />
      </CardBase>
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
