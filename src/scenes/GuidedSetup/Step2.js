import React from 'react';
import Typography from '@material-ui/core/Typography';

import DeliverableGridSelect from '../../scenes/Deliverables/DeliverableGridSelect'

import { Styles } from './styles'

export const Step2 = ({ values, onChange, onSelect, taskUUID }) => {
    const classes = Styles()
    return (
      <div className={classes.columnWrapper}>
        <div classes={classes.block}>
          <Typography variant="h6" gutterBottom >{"Select number of items and priority"}</Typography>
          <DeliverableGridSelect taskUUID={taskUUID}/>
        </div>
      </div>
    )
}
