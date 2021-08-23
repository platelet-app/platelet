import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ContactForm } from '../../../../components/ContactForm'

const step1Styles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
    },
  }));

export const Step1 = ({ values, onChange }) => {
    return (
        <div>
            <Typography>{"What are the caller's contact details?"}</Typography>
            <ContactForm values={values['caller']} onChange={onChange} />
        </div>
    )
}
