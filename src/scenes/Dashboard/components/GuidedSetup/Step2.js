import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { ContactForm } from '../../../../components/ContactForm'
import LocationDetailAndSelector from '../../../Task/components/LocationDetailAndSelector'

const useStyles = makeStyles((theme) => ({
    root: {
       display: 'flex',
       justifyContent: 'center',
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '30ch',
      },
    },
  }));

export const Step2 = ({ values, onChange, onSelect }) => {
    return (
        <div>
            <Typography>{"Where is it being picked up from?"}</Typography>
            <LocationDetailAndSelector displayPresets onSelectPreset={onSelect} location={values.pickUpLocation} />
            <Typography>{"Sender Contact:"}</Typography>
            <ContactForm values={values['sender']} onChange={onChange} />
        </div>
    )
}
