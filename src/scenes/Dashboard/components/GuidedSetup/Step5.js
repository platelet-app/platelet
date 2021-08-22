import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeliverableGridSelect from '../../../Deliverables/DeliverableGridSelect'

export const Step5 = () => {
    return (    
        <div>
            <Typography>{"What is being delivered?"}</Typography>
            <DeliverableGridSelect />
        </div>
    )
}
