import React from 'react';
import Typography from '@mui/material/Typography';

import { RiderPicker } from './components/RiderPicker'

import { Styles } from './styles'

export const Step4 = () => {
    const classes = Styles()

    return (
        <div className={classes.wrapper}>
            <Typography variant="h6" gutterBottom >{"Potential Riders"}</Typography>
            <div>
                <RiderPicker />
            </div>
        </div>
    )
}
