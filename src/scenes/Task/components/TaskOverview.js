import React from "react";
import { PropTypes } from "prop-types";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import PickUpDetails from "./PickUpDetails";
import DropOffDetails from "./DropOffDetails";
import TaskDetailsPanel from "./TaskDetailsPanel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import TaskAssignmentsPanel from "./TaskAssignmentsPanel";
import DeliverableDetails from "./DeliverableDetails";

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
                        onChangeTimePickedUp={props.onChangeTimePickedUp}
                        onClearPickUpLocation={props.onClearPickUpLocation}
                        onChange={props.onChangePickUpLocation}
                        onSelectPickupPreset={props.onSelectPickUpPreset}
                        onEditPreset={props.onEditPickUpPreset}
                        onChange={props.onChangePickUpLocation}
                        location={task.pickUpLocation}
                        time={task.timePickedUp}
                        showContact
                    />
                </Grid>
                <Grid className={classes.item} item>
                    <DropOffDetails
                        disableTimeButton={!!!task.timePickedUp}
                        taskUUID={taskUUID}
                        onSelectDropOffPreset={props.onSelectDropOffPreset}
                        onClearDropOffLocation={props.onClearDropOffLocation}
                        onEditPreset={props.onEditDropOffPreset}
                        onChange={props.onChangeDropOffLocation}
                        onChangeTimeDroppedOff={props.onChangeTimeDroppedOff}
                        location={task.dropOffLocation}
                        time={task.timeDroppedOff}
                        showContact
                    />
                </Grid>
                <Grid className={classes.item} item>
                    <TaskDetailsPanel
                        onSelectPriority={props.onSelectPriority}
                        onChangeTimeCancelled={props.onChangeTimeCancelled}
                        onChangeTimeRejected={props.onChangeTimeRejected}
                        onChangeRequesterContact={
                            props.onChangeRequesterContact
                        }
                        task={task}
                    />
                </Grid>
                <Grid className={classes.item} item>
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
    onUpdateDeliverable: PropTypes.func,
    onDeleteDeliverable: PropTypes.func,
    onChangeTimeCancelled: PropTypes.func,
    onChangeTimeRejected: PropTypes.func,
};

TaskOverview.defaultProps = {
    onUpdateDeliverable: () => {},
    onDeleteDeliverable: () => {},
    onChangeTimeCancelled: () => {},
    onChangeTimeRejected: () => {},
};

export default TaskOverview;
