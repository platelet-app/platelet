import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {TaskAdded, TaskNew, TaskDelivered, TaskAssigned, TaskActive} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import {Typography} from "@material-ui/core";
import {convertDate} from '../utilities'

export function TaskCard(props) {
    const pickupTitle = (props.pickupAddress.ward) ? props.pickupAddress.line1 + " | " + props.pickupAddress.ward : props.pickupAddress.line1;
    const dropoffTitle = (props.dropoffAddress.ward) ? props.dropoffAddress.line1 + " | " + props.dropoffAddress.ward : props.dropoffAddress.line1;
    const rider = (props.assignedRider.name) ? props.assignedRider.name + " | " + props.assignedRider.patch : "";
    if (props.assignedRider === null) {
        return (
            <div onClick={props.onClick}>
                <TaskNew>
                    <CardContent>
                        <h5>{pickupTitle}<br/>{dropoffTitle}</h5>
                        <Typography variant="body2" component="p">
                            {convertDate(props.timestamp)}
                        </Typography>
                    </CardContent>
                </TaskNew>
            </div>
        )
    } else if (props.assignedRider && !props.pickupTime) {
        return (
            <div onClick={props.onClick}>
                <TaskAssigned>
                    <CardContent>
                        <h4>{rider}</h4>
                        <h5>{pickupTitle}<br/>{dropoffTitle}</h5>
                        <Typography variant="body2" component="p">
                            {convertDate(props.timestamp)}
                        </Typography>
                    </CardContent>
                </TaskAssigned>
            </div>
        )
    } else if (props.assignedRider && props.pickupTime && !props.dropoffTime) {
        return (
            <div onClick={props.onClick}>
                <TaskActive>
                    <CardContent>
                        <h4>{rider}</h4>
                        <h5>{pickupTitle}<br/>{dropoffTitle}</h5>
                        <Typography variant="body2" component="p">
                            {convertDate(props.timestamp)}
                        </Typography>
                    </CardContent>
                </TaskActive>
            </div>
        )

    } else if (props.dropoffTime) {
        return (
            <div onClick={props.onClick}>
                <TaskDelivered>
                    <CardContent>
                        <h4>{rider}</h4>
                        <h5>{pickupTitle}<br/>{dropoffTitle}</h5>
                        <Typography variant="body2" component="p">
                            {convertDate(props.timestamp)}
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
                        <h4>{rider}</h4>
                        <h5>{pickupTitle}<br/>{dropoffTitle}</h5>
                        <Typography variant="body2" component="p">
                            {convertDate(props.timestamp)}
                        </Typography>
                    </CardContent>
                </TaskAdded>
            </div>
        )
    }
}
