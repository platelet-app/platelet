import React from 'react';
import Typography from '@mui/material/Typography';

import { ContactForm } from '../../components/ContactForm'
import LocationDetailAndSelector from '../../scenes/Task/components/LocationDetailAndSelector'

import { Styles } from './styles'

export const Step3 = ({ values, onChange, onSelect }) => {
    const classes = Styles()
    return (
        <div className={classes.columnWrapper}>
            <div classes={classes.block}>
                <Typography variant="h6" gutterBottom >{"Where is it being delivered?"}</Typography>
                <LocationDetailAndSelector displayPresets onSelectPreset={onSelect} location={values.dropOffLocation} />
            </div>

            <div classes={classes.block}>
                <Typography variant="h6" gutterBottom >{"Recipient contact:"}</Typography>
                <ContactForm values={values['receiver']} onChange={onChange} />
            </div>
        </div>
    )
}
