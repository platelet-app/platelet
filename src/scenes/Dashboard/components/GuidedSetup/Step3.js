import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ContactForm } from '../../../../components/ContactForm'
import LocationDetailAndSelector from '../../../Task/components/LocationDetailAndSelector'

export const Step3 = ({ values, onChange, onSelect }) => {
    return (
        <div>
            <Typography>{"Where is it being delivered?"}</Typography>
            <LocationDetailAndSelector displayPresets onSelectPreset={onSelect} location={values.dropOffLocation} />
            <Typography>{"Recipient contact:"}</Typography>
            <ContactForm values={values['receiver']} onChange={onChange} />
        </div>
    )
}
