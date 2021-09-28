import React from 'react';
import { ContactForm } from '../../components/ContactForm'

import { Styles } from './styles'

export const Step1 = ({ values, onChange }) => {
  const classes = Styles()
    return (
        <div className={classes.wrapper}>
            <ContactForm values={values['caller']} onChange={onChange} />
        </div>
    )
}
