import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledCard, TaskAdded, TaskNew, TaskDelivered, TaskAssigned, TaskActive} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import {Typography} from "@material-ui/core";
import {convertDate} from '../utilities'
import TaskDialog from "./TaskModal";

export function TaskCard(props) {
    if (props.task.assigned_rider === null) {
        return (
            <div onClick={props.onClick}>
                <TaskNew>
                    <CardContent>
                        <h4>Task</h4>
                        <Typography variant="body2" component="p">
                            {convertDate(props.task.timestamp)}
                        </Typography>
                    </CardContent>
                </TaskNew>
            </div>
        )
    } else if (props.task.assigned_rider && !props.task.pickup_time) {
        return (
            <div onClick={props.onClick}>
                <TaskAssigned>
                    <CardContent>
                        <h4>Task</h4>
                        <Typography variant="body2" component="p">
                            {convertDate(props.task.timestamp)}
                        </Typography>
                    </CardContent>
                </TaskAssigned>
            </div>
        )
    } else if (props.task.assigned_rider && props.task.pickup_time && !props.task.dropoff_time) {
        return (
            <div onClick={props.onClick}>
                <TaskActive>
                    <CardContent>
                        <h4>Task</h4>
                        <Typography variant="body2" component="p">
                            {convertDate(props.task.timestamp)}
                        </Typography>
                    </CardContent>
                </TaskActive>
            </div>
        )

    } else if (props.task.dropoff_time) {
        return (
            <div onClick={props.onClick}>
                <TaskDelivered>
                    <CardContent>
                        <h4>Task</h4>
                        <Typography variant="body2" component="p">
                            {convertDate(props.task.timestamp)}
                        </Typography>
                    </CardContent>
                </TaskDelivered>
            </div>
        )
    } else {
        return (
            <div onClick={props.onClick}>
                <TaskAdded>
                    <CardContent>
                        <h4>Task</h4>
                        <Typography variant="body2" component="p">
                            {convertDate(props.task.timestamp)}
                        </Typography>
                    </CardContent>
                </TaskAdded>
            </div>
        )

    }
}
