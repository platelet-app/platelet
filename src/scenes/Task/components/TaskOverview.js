import React, { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import PickUpDetails from "./PickUpDetails";
import DropOffDetails from "./DropOffDetails";
import TaskDetailsPanel from "./TaskDetailsPanel";
import DeliverableGridSelect from "../../Deliverables/DeliverableGridSelect";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import TaskAssignmentsPanel from "./TaskAssignmentsPanel";
import * as queries from "../../../graphql/queries";
import API from "@aws-amplify/api";

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        overflow: "",
    },
    root: {
        maxWidth: 1800,
        paddingTop: 20,
        [theme.breakpoints.down("md")]: {
            padding: 5,
            paddingTop: 5,
        },
    },

    item: {
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: 0,
            minWidth: 425,
        },
    },
    comments: {
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "95%",
        },
    },
    container: {
        //width: "100%",
        //margin: 0
    },
    statusBar: {
        paddingBottom: 8,
    },
    separator: {
        height: 25,
        width: 25,
    },
}));

const initialLocationState = {
    address: null,
    contact: { name: null, telephone_number: null },
    protected: false,
    listed: false,
};
const initialState = {
    task: {
        uuid: null,
        reference: "",
        etag: "",
        author: null,
        author_uuid: null,
        pickupLocation: initialLocationState,
        dropoffLocation: initialLocationState,
        patch: null,
        requesterContact: {
            name: null,
            telephoneNumber: null,
        },
        priority: null,
        timeOfCall: null,
        deliverables: null,
        comments: null,
        links: null,
        timePickedUp: null,
        timeDroppedOff: null,
        rider: null,
        assignedRiders: [],
        assignedCoordinators: [],
        timeCancelled: null,
        timeRejected: null,
        createdAt: null,
        updatedAt: null,
        orderInRelay: 0,
        assignedRidersDisplayString: "",
        assignedCoordinatorsDisplayString: "",
    },
    error: null,
};

function TaskOverview(props) {
    const { taskUUID, task } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("xs"));

    return (
        <Container className={classes.root} maxWidth={true}>
            <Grid
                container
                className={classes.container}
                spacing={isSm ? 1 : 3}
                item
                direction={"row"}
                alignItems={"flex-start"}
                justify={"flex-start"}
            >
                <Grid className={classes.item} item>
                    <PickUpDetails
                        taskUUID={taskUUID}
                        location={task.pickup_location}
                        time={task.time_picked_up}
                        showContact
                    />
                </Grid>
                <Grid className={classes.item} item>
                    <DropOffDetails
                        disableTimeButton={!!!task.time_picked_up}
                        taskUUID={taskUUID}
                        location={task.dropoff_location}
                        time={task.time_dropped_off}
                        showContact
                    />
                </Grid>
                <Grid className={classes.item} item>
                    <TaskDetailsPanel task={task} />
                </Grid>
                <Grid className={classes.item} item>
                    <DeliverableGridSelect taskUUID={taskUUID} />
                </Grid>
                <Grid className={classes.item} item>
                    <TaskAssignmentsPanel />
                </Grid>
            </Grid>
        </Container>
    );
}

TaskOverview.propTypes = {
    task: PropTypes.object,
    taskUUID: PropTypes.string,
};

export default TaskOverview;
