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
import { Divider, Hidden, Stack } from "@mui/material";
import LocationDetailsPanel from "./LocationDetailsPanel";
import TaskAssignmentsPanel from "./TaskAssignmentsPanel";
import CommentsSection from "../../Comments/CommentsSection";

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
    const { taskId, task } = props;
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
                            taskId={taskId}
                        />
                        <TaskActions taskId={taskId} />
                        <Hidden xlUp>
                            <DeliverableDetails
                                deliverables={
                                    task.deliverables
                                        ? Object.values(task.deliverables)
                                        : []
                                }
                                taskId={taskId}
                            />
                        </Hidden>
                    </Stack>
                </Grid>
                <Grid item className={classes.item}>
                    <Stack direction={"column"} spacing={isSm ? 1 : 3}>
                        <LocationDetailsPanel
                            taskId={taskId}
                            locationKey={"pickUpLocation"}
                        />

                        <LocationDetailsPanel
                            taskId={taskId}
                            locationKey={"dropOffLocation"}
                        />
                        <Hidden mdUp>
                            <TaskAssignmentsPanel taskId={taskId} />
                        </Hidden>
                    </Stack>
                </Grid>
                <Hidden xlDown>
                    <Grid item className={classes.item}>
                        <DeliverableDetails
                            deliverables={
                                task.deliverables
                                    ? Object.values(task.deliverables)
                                    : []
                            }
                            taskId={taskId}
                        />
                    </Grid>
                </Hidden>
                <Hidden mdUp>
                    <Grid item className={classes.item}>
                        <CommentsSection parentId={taskId} />
                    </Grid>
                </Hidden>
            </Grid>
        </Container>
    );
}

TaskOverview.propTypes = {
    task: PropTypes.object,
    isFetching: PropTypes.bool,
    taskId: PropTypes.string,
    onChangeTimeOfCall: PropTypes.func,
};

TaskOverview.defaultProps = {
    isFetching: false,
    onChangeTimeOfCall: () => {},
};

export default TaskOverview;
