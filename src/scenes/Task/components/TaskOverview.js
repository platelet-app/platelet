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
    root: {
        maxWidth: 1800,
        padding: 15,
        [theme.breakpoints.down("xl")]: {
            padding: 5,
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
                direction="row"
                className={classes.container}
                spacing={isSm ? 1 : 3}
            >
                <Grid item className={classes.item}>
                    <Stack direction={"column"} spacing={isSm ? 1 : 3}>
                        <TaskDetailsPanel
                            isFetching={props.isFetching}
                            onSelectPriority={props.onSelectPriority}
                            onChangeTimeOfCall={props.onChangeTimeOfCall}
                            onChangeTimeDroppedOff={
                                props.onChangeTimeDroppedOff
                            }
                            onChangeTimePickedUp={props.onChangeTimePickedUp}
                            onChangeRequesterContact={
                                props.onChangeRequesterContact
                            }
                            taskId={taskUUID}
                            task={task}
                        />
                        <TaskActions taskId={taskUUID} />
                    </Stack>
                </Grid>
                <Grid item className={classes.item}>
                    <Stack direction={"column"} spacing={isSm ? 1 : 3}>
                        <LocationDetailsPanel
                            taskId={taskUUID}
                            task={task}
                            locationId={
                                task.pickUpLocation
                                    ? task.pickUpLocation.id
                                    : null
                            }
                            locationKey={"pickUpLocation"}
                        />

                        <LocationDetailsPanel
                            taskId={taskUUID}
                            task={task}
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
    isFetching: PropTypes.bool,
    taskUUID: PropTypes.string,
    onChangeTimeCancelled: PropTypes.func,
    onChangeTimeRejected: PropTypes.func,
    onChangeTimeOfCall: PropTypes.func,
};

TaskOverview.defaultProps = {
    isFetching: false,
    onChangeTimeCancelled: () => {},
    onChangeTimeRejected: () => {},
    onChangeTimeOfCall: () => {},
};

export default TaskOverview;
