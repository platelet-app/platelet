import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {TaskAdded, TaskNew, TaskDelivered, TaskAssigned, TaskActive} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import {Typography} from "@material-ui/core";
import Moment from "react-moment";
import TaskContextMenu from "./TaskContextMenu";
import Grid from "@material-ui/core/Grid";

export function TaskCard(props) {
    let pickupTitle = "";
    if (props.pickupAddress) {
        pickupTitle = (props.pickupAddress.ward) ? props.pickupAddress.line1 + " | " + props.pickupAddress.ward : props.pickupAddress.line1;
    }
    let dropoffTitle = "";
    if (props.dropoffAddress) {
        dropoffTitle = (props.dropoffAddress.ward) ? props.dropoffAddress.line1 + " | " + props.dropoffAddress.ward : props.dropoffAddress.line1;
    }
    let rider = "";
    let hasRider = false;
    if (props.assignedRider) {
        rider = (props.assignedRider.name) ? props.assignedRider.name + " | " + props.assignedRider.patch : "";
        hasRider = true;
    }
    const cardInnerContent =
        <CardContent>
            <h4>{rider}</h4>
            <h5>{pickupTitle}<br/>{dropoffTitle}</h5>
            <Typography variant="body2" component="p">
                <Moment format={"llll"}>{props.timestamp}</Moment>
            </Typography>
            <h4>{props.priority}</h4>
        </CardContent>;
    if (!hasRider) {
        return (
                <TaskNew>
                    {cardInnerContent}
                </TaskNew>
        )
    } else if (hasRider && !props.pickupTime) {
        return (
                <TaskAssigned>
                    {cardInnerContent}
                </TaskAssigned>
        )
    } else if (hasRider && props.pickupTime && !props.dropoffTime) {
        return (
                <TaskActive>
                    {cardInnerContent}
                </TaskActive>
        )

    } else if (props.dropoffTime) {
        return (
                <TaskDelivered>
                    {cardInnerContent}
                </TaskDelivered>
        )
    } else {
        return (
                <TaskAdded>
                    {cardInnerContent}
                </TaskAdded>
        )
    }
}
