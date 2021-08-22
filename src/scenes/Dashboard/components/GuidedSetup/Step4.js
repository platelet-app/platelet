import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PrioritySelect from "../../../Task/components/PrioritySelect";

const step4Styles = makeStyles((theme) => ({
    select: {
      display: 'flex',
      justifyContent: 'center'
    },
  }));

export const Step4 = () => {
    const classes = step4Styles()

    return (
        <div>
            <Typography>{"What is the priority?"}</Typography>
            <div className={classes.select}>
                <PrioritySelect />
            </div>
        </div>
    )
}
