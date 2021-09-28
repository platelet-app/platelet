import React from 'react';
import Typography from '@material-ui/core/Typography';

import LocationSelector from './components/LocationSelector'

import { Styles } from './styles'

export const Step3 = ({ values, onChange, onSelect }) => {
    const classes = Styles()
    return (
        <div className={classes.columnWrapper}>
            <div classes={classes.block}>
                <Typography variant="h6" gutterBottom >{"Pick-up"}</Typography>
                <LocationSelector displayPresets onSelectPreset={onSelect} location={values.pickUpLocation} />
            </div>
            <div classes={classes.block}>
                <Typography variant="h6" gutterBottom >{"Drop-off"}</Typography>
                <LocationSelector displayPresets onSelectPreset={onSelect} location={values.dropOffLocation} />
            </div>
        </div>
    )
}
