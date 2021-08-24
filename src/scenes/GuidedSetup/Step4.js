import React from 'react';
import Typography from '@material-ui/core/Typography';

import PrioritySelect from "../../scenes/Task/components/PrioritySelect";

import { Styles } from './styles'

export const Step4 = () => {
    const classes = Styles()

    return (
        <div className={classes.wrapper}>
            <Typography variant="h6" gutterBottom >{"What is the priority?"}</Typography>
            <div>
                <PrioritySelect />
            </div>
        </div>
    )
}
