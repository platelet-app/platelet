import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {TaskAdded, TaskNew, TaskDelivered, TaskAssigned, TaskActive} from '../css/TaskCards';
import CardContent from '@material-ui/core/CardContent';
import {Typography} from "@material-ui/core";
import Moment from "react-moment";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardItem from "./CardItem"
import Divider from "@material-ui/core/Divider";

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
    const cardInnerContent =
        <CardContent>
            <Grid container spacing={0} direction={"column"}>
                <CardItem width={"170px"} label={"Assignee"}>{rider}</CardItem>
                <CardItem label={"Patch"}>{patch}</CardItem>
                <CardItem label={"From"}>{pickupTitle}</CardItem>
                <CardItem label={"Ward"}>{pickupWard}</CardItem>
                <CardItem label={"To"}>{dropoffTitle}</CardItem>
                <CardItem label={"Ward"}>{dropoffWard}</CardItem>
                <CardItem label={"TOC"}><Moment calendar>{props.time_of_call}</Moment></CardItem>
                <CardItem width={"185px"} label={"Priority"}>{props.priority}</CardItem>
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
