import React from 'react';
import Typography from '@mui/material/Typography';
import { Scrollbars } from 'react-custom-scrollbars';

import ItemSelector from './components/ItemSelector'
import PrioritySelect from "../../scenes/Task/components/PrioritySelect";

import { Styles } from './styles'

export const Step2 = ({ values, onChange, onSelect, taskUUID }) => {
    const classes = Styles()
    return (
      <Scrollbars 
        autoHide 
        autoHeight
        autoHeightMin={450}
        autoHeightMax={350}>
        <div className={classes.columnWrapper}>
          <div classes={classes.block}>
            <Typography variant="h6" gutterBottom >{"Select number of items and priority"}</Typography>
            <ItemSelector taskUUID={taskUUID}/>

            <div>
              <PrioritySelect />
            </div>
          </div>
        </div>
    </Scrollbars>
    )
}
