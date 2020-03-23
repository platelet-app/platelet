import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {TaskAdded, TaskNew, TaskDelivered, TaskAssigned, TaskActive, StyledStrip} from '../css/TaskStrips';
import CardContent from '@material-ui/core/CardContent';
import {Typography} from "@material-ui/core";
import Moment from "react-moment";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

export function TaskStrip(props) {
    const itemsList = [];
    if (props.pickupAddress) {
        itemsList.push("From: " + props.pickupAddress.ward ? props.pickupAddress.line1 + " | " + props.pickupAddress.ward : props.pickupAddress.line1);
    }
    if (props.dropoffAddress) {
        itemsList.push("To: " + props.dropoffAddress.ward ? props.dropoffAddress.line1 + " | " + props.dropoffAddress.ward : props.dropoffAddress.line1);
    }
    let hasRider = false;
    if (props.assignedRider) {
        itemsList.push(props.assignedRider.display_name ? props.assignedRider.display_name + " | " + props.assignedRider.patch : "");
        hasRider = true;
    }
    itemsList.push(<Moment format={"llll"}>{props.timestamp}</Moment>);
    if (props.priority)
        itemsList.push(props.priority);
    const divider = <Grid item><Divider orientation="vertical" flexItem/></Grid>;
    const cardInnerContent =
        <CardContent style={{fontWeight: "bold"}}>
            <Grid container spacing={1} direction={"row"} justify={"flex-start"}>
                {itemsList.map((entry) => (
                    <>
                    <Grid item>
                        {entry}
                    </Grid>
                    {divider}
                    </>
                ))}
            </Grid>
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

