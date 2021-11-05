import React from "react";
import { PropTypes } from "prop-types";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TaskDetailsPanel from "./TaskDetailsPanel";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import DeliverableDetails from "./DeliverableDetails";
import TaskActions from "./TaskActions";
import { Stack } from "@mui/material";
import LocationDetailsPanel from "./LocationDetailsPanel";

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
                        <LocationDetailsPanel
                            taskId={taskUUID}
                            locationId={
                                task.pickUpLocation
                                    ? task.pickUpLocation.id
                                    : null
                            }
                            locationKey={"pickUpLocation"}
                        />

                        <LocationDetailsPanel
                            taskId={taskUUID}
                            locationId={
                                task.dropOffLocation
                                    ? task.dropOffLocation.id
                                    : null
                            }
                            locationKey={"dropOffLocation"}
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
                            taskId={taskUUID}
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
    onChangeTimeCancelled: PropTypes.func,
    onChangeTimeRejected: PropTypes.func,
    onChangeTimeOfCall: PropTypes.func,
};

TaskOverview.defaultProps = {
    onChangeTimeCancelled: () => {},
    onChangeTimeRejected: () => {},
    onChangeTimeOfCall: () => {},
};

export default TaskOverview;
