import React from 'react';
import Typography from '@material-ui/core/Typography';

import { ContactForm } from '../../components/ContactForm'
import LocationDetailAndSelector from '../../scenes/Task/components/LocationDetailAndSelector'

import { Styles } from './styles'

export const Step2 = ({ values, onChange, onSelect }) => {
    const classes = Styles()
    return (
      <div className={classes.columnWrapper}>
        <div classes={classes.block}>
          <Typography variant="h6" gutterBottom >{"Where is it being picked up from?"}</Typography>
          <LocationDetailAndSelector displayPresets onSelectPreset={onSelect} location={values.pickUpLocation} />
        </div>

        <div classes={classes.block}>
          <Typography variant="h6" gutterBottom >{"Sender Contact:"}</Typography>
          <ContactForm values={values['sender']} onChange={onChange} />
        </div>
      </div>
    )
}
