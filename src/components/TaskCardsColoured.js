import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledCard, TaskAdded, TaskNew, TaskDelivered, TaskAssigned, TaskActive} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import {Typography} from "@material-ui/core";
import {convertDate} from '../utilities'

export function TaskCard(props) {
    if (props.task.assigned_rider === null){
        return (
            <TaskNew>
                <CardContent>
                    <h4>Task</h4>
                    <Typography variant="body2" component="p">
                        {convertDate(props.task.timestamp)}
                    </Typography>
                </CardContent>
            </TaskNew>
        )
    }
    else if (props.task.assigned_rider && !props.task.pickup_time)
    {
        return (
            <TaskAssigned>
                <CardContent>
                    <h4>Task</h4>
                    <Typography variant="body2" component="p">
                        {convertDate(props.task.timestamp)}
                    </Typography>
                </CardContent>
            </TaskAssigned>
        )
    }
    else if (props.task.assigned_rider && props.task.pickup_time && !props.task.dropoff_time)
    {
        return (
            <TaskActive>
                <CardContent>
                    <h4>Task</h4>
                    <Typography variant="body2" component="p">
                        {convertDate(props.task.timestamp)}
                    </Typography>
                </CardContent>
            </TaskActive>
        )

    }
    else if (props.task.dropoff_time) {
        return (
            <TaskDelivered>
                <CardContent>
                    <h4>Task</h4>
                    <Typography variant="body2" component="p">
                        {convertDate(props.task.timestamp)}
                    </Typography>
                </CardContent>
            </TaskDelivered>
        )
    }
    else {
        return (
            <TaskAdded>
                <CardContent>
                    <h4>Task</h4>
                    <Typography variant="body2" component="p">
                        {convertDate(props.task.timestamp)}
                    </Typography>
                </CardContent>
            </TaskAdded>
        )

    }
}

