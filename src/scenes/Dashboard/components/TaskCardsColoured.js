import React from 'react';
import '../../../App.css';
import 'typeface-roboto'
import {TaskAdded, TaskNew, TaskDelivered, TaskAssigned, TaskActive} from '../../Task/styles/TaskCards';
import CardContent from '@material-ui/core/CardContent';
import Moment from "react-moment";
import Grid from "@material-ui/core/Grid";
import CardItem from "../../../components/CardItem"

const TaskCard = React.memo((props) => {
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
    const hasRider = props.assignedUsers ? !!props.assignedUsers.length : false;
    const ridersNames = props.assignedUsers ? props.assignedUsers : "";
    const patch = props.patch ? props.patch : "";
    const cardInnerContent =
        <CardContent>
            <Grid container spacing={0} direction={"column"}>
                <CardItem width={"170px"} label={"Assignee"}>{ridersNames}</CardItem>
                <CardItem label={"Patch"}>{patch}</CardItem>
                <CardItem label={"From"}>{pickupTitle}</CardItem>
                <CardItem label={"Ward"}>{pickupWard}</CardItem>
                <CardItem label={"To"}>{dropoffTitle}</CardItem>
                <CardItem label={"Ward"}>{dropoffWard}</CardItem>
                <CardItem label={"TOC"}><Moment local calendar>{props.time_of_call}</Moment></CardItem>
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
})

export default TaskCard;