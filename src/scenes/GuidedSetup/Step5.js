import React from 'react';
import Typography from '@material-ui/core/Typography';

import DeliverableGridSelect from '../../scenes/Deliverables/DeliverableGridSelect'

import { Styles } from './styles'

export const Step5 = ({ values, taskUUID }) => {
    const classes = Styles()
    return (    
        <div className={classes.wrapper}>
            <Typography variant="h6" gutterBottom >{"Select number of items and priority"}</Typography>
            <DeliverableGridSelect taskUUID={taskUUID}/>
        </div>
    )
}
