import React from "react";
import { PropTypes } from "prop-types";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import PickUpDetails from "./PickUpDetails";
import { Hidden } from "@material-ui/core";
import DropOffDetails from "./DropOffDetails";
import TaskDetailsPanel from "./TaskDetailsPanel";
import DeliverableGridSelect from "../../Deliverables/DeliverableGridSelect";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import TaskAssignmentsPanel from "./TaskAssignmentsPanel";

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        overflow: "",
    },
    root: {
        paddingTop: 20,
        [theme.breakpoints.down("md")]: {
            padding: 5,
            paddingTop: 5,
        },
        margin: "auto",
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
    const { task, taskUUID } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("xs"));

    return (
        <Container className={classes.root} maxWidth={true}>
            <Grid
                container
                className={classes.container}
                spacing={isSm ? 0 : 3}
                direction={"column"}
                alignItems={"center"}
                justify={"center"}
            >
                <Grid
                    container
                    className={classes.container}
                    spacing={isSm ? 0 : 3}
                    item
                    direction={"row"}
                    justify={"center"}
                >
                    <Grid className={classes.item} item>
                        <PickUpDetails
                            taskUUID={taskUUID}
                            location={task.pickup_location}
                            time={task.time_picked_up}
                        />
                    </Grid>
                    <Hidden smUp>
                        <Grid item>
                            <div className={classes.separator} />
                        </Grid>
                    </Hidden>
                    <Grid className={classes.item} item>
                        <DropOffDetails
                            disableTimeButton={!!!task.time_picked_up}
                            taskUUID={taskUUID}
                            location={task.dropoff_location}
                            time={task.time_dropped_off}
                        />
                    </Grid>
                </Grid>
                <Hidden smUp>
                    <Grid item>
                        <div className={classes.separator} />
                    </Grid>
                </Hidden>
                <Grid
                    container
                    className={classes.container}
                    spacing={isSm ? 0 : 3}
                    item
                    direction={"row"}
                    justify={"center"}
                >
                    <Grid className={classes.item} item>
                        <TaskDetailsPanel />
                    </Grid>
                    <Hidden smUp>
                        <Grid item>
                            <div className={classes.separator} />
                        </Grid>
                    </Hidden>
                    <Grid className={classes.item} item>
                        <DeliverableGridSelect taskUUID={taskUUID} />
                    </Grid>
                    <Grid className={classes.item} item>
                        <TaskAssignmentsPanel />
                    </Grid>
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
