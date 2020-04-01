import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {TaskAdded, TaskNew, TaskDelivered, TaskAssigned, TaskActive} from '../css/TaskCards';
import CardContent from '@material-ui/core/CardContent';
import {Typography} from "@material-ui/core";
import Moment from "react-moment";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles({
    titleText: {
        fontSize: "13px",
        width: "20px"
    },
    cardText: {
        fontSize: "14px",
    }
});

function GridItem(props) {
    const classes = useStyles();
    return (
        <Grid item>
            <Grid container spacing={1} direction={"row"} alignItems={"flex-end"} justify={"space-between"}>
                <Grid item>
                    <Typography className={classes.titleText}>{props.label}:</Typography>
                </Grid>
                <Grid item>
                    <Typography style={{width: props.width ? props.width : "193px"}} align={"right"} noWrap={true} className={classes.cardText}>{props.children}</Typography>
                </Grid>
            </Grid>
        </Grid>
    )

}
export function TaskCard(props) {
    let pickupTitle = "";
    if (props.pickupAddress) {
        pickupTitle = props.pickupAddress.line1 ? props.pickupAddress.line1 : "";
    }
    let pickupWard = "";
    if (props.pickupAddress) {
        pickupWard = props.pickupAddress.ward ? props.pickupAddress.ward : "";
    }
    let dropoffTitle = "";
    if (props.dropoffAddress) {
        dropoffTitle = (props.dropoffAddress.line1) ?  props.dropoffAddress.line1 : "";
    }
    let dropoffWard = "";
    if (props.dropoffAddress) {
        dropoffWard = props.dropoffAddress.ward ? props.dropoffAddress.ward : ""
    }
    let rider = "";
    let hasRider = false;
    if (props.assignedRider) {
        rider = (props.assignedRider.display_name) ? props.assignedRider.display_name : "";
        hasRider = true;
    }
    const patch = props.patch ? props.patch : "";
    const divider = <Grid item><Divider orientation="horizontal" flexItem/></Grid>;
    const cardInnerContent =
        <CardContent>
            <Grid containerspacing={1} direction={"column"}>
                <GridItem width={"170px"} label={"Assignee"}>{rider}</GridItem>
                {divider}
                <GridItem label={"Patch"}>{patch}</GridItem>
                {divider}
                <GridItem label={"From"}>{pickupTitle}</GridItem>
                {divider}
                <GridItem label={"Ward"}>{pickupWard}</GridItem>
                {divider}
                <GridItem label={"To"}>{dropoffTitle}</GridItem>
                {divider}
                <GridItem label={"Ward"}>{dropoffWard}</GridItem>
                {divider}
                <GridItem label={"TOC"}><Moment format={"llll"}>{props.timestamp}</Moment></GridItem>
                {divider}
                <GridItem width={"185px"} label={"Priority"}>{props.priority}</GridItem>
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
