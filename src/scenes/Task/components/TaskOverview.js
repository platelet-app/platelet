import React from "react";
import { PropTypes } from "prop-types";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TaskDetailsPanel from "./TaskDetailsPanel";
import * as models from "../../../models";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import DeliverableDetails from "../../sharedTaskComponents/DeliverableDetails";
import TaskActions from "./TaskActions";
import { Hidden, Stack } from "@mui/material";
import LocationDetailsPanel from "../../sharedTaskComponents/LocationDetailsPanel";
import TaskAssignmentsPanel from "./TaskAssignmentsPanel";
import CommentsSection from "../../Comments/CommentsSection";
import PendingTaskAcceptReject from "./PendingTaskAcceptReject";

const useStyles = makeStyles()((theme) => ({
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

function TaskOverview({ taskId, isFetching }) {
    const { classes } = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Container className={classes.root}>
            <PendingTaskAcceptReject taskId={taskId} />
            <Grid container direction="row" spacing={isSm ? 1 : 3}>
                <Grid item className={classes.item}>
                    <Stack direction={"column"} spacing={isSm ? 1 : 3}>
                        <TaskDetailsPanel
                            isFetching={isFetching}
                            taskId={taskId}
                        />
                        <TaskActions taskId={taskId} />
                    </Stack>
                </Grid>
                <Grid item className={classes.item}>
                    <Stack direction={"column"} spacing={isSm ? 1 : 3}>
                        <LocationDetailsPanel
                            taskModel={models.Task}
                            taskId={taskId}
                            locationKey={"pickUpLocation"}
                        />

                        <LocationDetailsPanel
                            taskModel={models.Task}
                            taskId={taskId}
                            locationKey={"dropOffLocation"}
                        />
                        <DeliverableDetails
                            taskModelType="Task"
                            taskId={taskId}
                        />
                        <Hidden mdUp>
                            <TaskAssignmentsPanel taskId={taskId} />
                        </Hidden>
                    </Stack>
                </Grid>
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
    isFetching: PropTypes.bool,
    taskId: PropTypes.string,
    onChangeTimeOfCall: PropTypes.func,
    assignmentRole: PropTypes.string,
};

TaskOverview.defaultProps = {
    isFetching: false,
    onChangeTimeOfCall: () => {},
    assignmentRole: null,
};

export default TaskOverview;
