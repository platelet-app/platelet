import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {TaskAdded, TaskNew, TaskDelivered, TaskAssigned, TaskActive} from '../scenes/Task/styles/TaskStrips';
import CardContent from '@mui/material/CardContent';
import Moment from "react-moment";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";

// Not currently used in favour of cards/material table.
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
    itemsList.push(<Moment local format={"llll"}>{props.timestamp}</Moment>);
    if (props.priority)
        itemsList.push(props.priority);
    const divider = <Grid item><Divider orientation="vertical" flexItem/></Grid>;
    const cardInnerContent =
        <CardContent>
            <Grid container spacing={1} direction={"row"} justify={"flex-start"}>
                {itemsList.map((entry, i, arr) => (
                    <>
                    <Grid item>
                        <Typography style={{maxWidth: "400px"}} noWrap>
                            {entry}
                        </Typography>
                    </Grid>
                    {arr.length - 1 !== i ? divider : <></>}
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

