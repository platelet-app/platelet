import React from 'react';
import Typography from '@mui/material/Typography';
import { ContactForm } from '../../components/ContactForm'

import { Styles } from './styles'

export const Step1 = ({ values, onChange }) => {
  const classes = Styles()
    return (
        <div className={classes.wrapper}>
            <Typography variant="h6" gutterBottom>{"What are the caller's contact details?"}</Typography>
            <ContactForm values={values['caller']} onChange={onChange} />
        </div>
    )
}
