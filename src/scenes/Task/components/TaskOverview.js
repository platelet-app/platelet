import React from "react";
import { PropTypes } from "prop-types";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import PickUpDetails from "./PickUpDetails";
import DropOffDetails from "./DropOffDetails";
import TaskDetailsPanel from "./TaskDetailsPanel";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import TaskAssignmentsPanel from "./TaskAssignmentsPanel";
import DeliverableDetails from "./DeliverableDetails";
import TaskActions from "./TaskActions";
import { Stack } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        overflow: "",
    },
    root: {
        maxWidth: 1800,
        paddingTop: 20,
        [theme.breakpoints.down("lg")]: {
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
    statusBar: {
        paddingBottom: 8,
    },
    separator: {
        height: 25,
        width: 25,
    },
}));

function TaskOverview(props) {
    const { taskUUID, task } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Container className={classes.root} maxWidth={true}>
            <Grid
                container
                className={classes.container}
                spacing={isSm ? 1 : 3}
            >
                <Grid item className={classes.item}>
                    <Stack direction={"column"} spacing={isSm ? 1 : 3}>
                        <TaskDetailsPanel
                            onSelectPriority={props.onSelectPriority}
                            onChangeTimeOfCall={props.onChangeTimeOfCall}
                            onChangeRequesterContact={
                                props.onChangeRequesterContact
                            }
                            task={task}
                        />
                        <TaskActions
                            onChangeTimePickedUp={props.onChangeTimePickedUp}
                            onChangeTimeCancelled={props.onChangeTimeCancelled}
                            onChangeTimeDroppedOff={
                                props.onChangeTimeDroppedOff
                            }
                            onChangeTimeRejected={props.onChangeTimeRejected}
                            task={props.task}
                        />
                    </Stack>
                </Grid>
                <Grid item className={classes.item}>
                    <Stack direction={"column"} spacing={isSm ? 1 : 3}>
                        <PickUpDetails
                            taskUUID={taskUUID}
                            onClearPickUpLocation={props.onClearPickUpLocation}
                            onChange={props.onChangePickUpLocation}
                            onSelectPickupPreset={props.onSelectPickUpPreset}
                            onEditPreset={props.onEditPickUpPreset}
                            location={task.pickUpLocation}
                            time={task.timePickedUp}
                            showContact
                        />
                        <DropOffDetails
                            disableTimeButton={!!!task.timePickedUp}
                            taskUUID={taskUUID}
                            onSelectDropOffPreset={props.onSelectDropOffPreset}
                            onClearDropOffLocation={
                                props.onClearDropOffLocation
                            }
                            onEditPreset={props.onEditDropOffPreset}
                            onChange={props.onChangeDropOffLocation}
                            location={task.dropOffLocation}
                            time={task.timeDroppedOff}
                            showContact
                        />
                    </Stack>
                </Grid>
                <Grid item className={classes.item}>
                    <Stack direction={"column"} spacing={isSm ? 1 : 3}>
                        <DeliverableDetails
                            deliverables={
                                task.deliverables
                                    ? Object.values(task.deliverables)
                                    : []
                            }
                            taskUUID={taskUUID}
                            onChange={props.onUpdateDeliverable}
                            onDelete={props.onDeleteDeliverable}
                        />
                        <TaskAssignmentsPanel
                            onSelect={props.onSelectAssignee}
                            task={props.task}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}

TaskOverview.propTypes = {
    task: PropTypes.object,
    taskUUID: PropTypes.string,
    onUpdateDeliverable: PropTypes.func,
    onDeleteDeliverable: PropTypes.func,
    onChangeTimeCancelled: PropTypes.func,
    onChangeTimeRejected: PropTypes.func,
    onChangeTimeOfCall: PropTypes.func,
    onSelectAssignee: PropTypes.func,
};

TaskOverview.defaultProps = {
    onUpdateDeliverable: () => {},
    onDeleteDeliverable: () => {},
    onChangeTimeCancelled: () => {},
    onChangeTimeRejected: () => {},
    onChangeTimeOfCall: () => {},
    onSelectAssignee: () => {},
};

export default TaskOverview;
