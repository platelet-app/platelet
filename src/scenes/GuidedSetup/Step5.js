import React from 'react';
import Typography from '@mui/material/Typography';

import DeliverableGridSelect from '../Deliverables/DeliverableGridSelect'

import { Styles } from './styles'

export const Step5 = ({ values, taskUUID }) => {
    const classes = Styles()
    return (    
        <div className={classes.wrapper}>
            <Typography variant="h6" gutterBottom >{"What is being delivered?"}</Typography>
            <DeliverableGridSelect taskUUID={taskUUID}/>
        </div>
    )
}
