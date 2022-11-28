import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TaskDetailsPanel from "./TaskDetailsPanel";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme, useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import DeliverableDetails from "./DeliverableDetails";
import TaskActions from "./TaskActions";
import { Hidden, Stack } from "@mui/material";
import LocationDetailsPanel from "./LocationDetailsPanel";
import TaskAssignmentsPanel from "./TaskAssignmentsPanel";
import CommentsSection from "../../Comments/CommentsSection";
import TaskOverViewTabs, { TaskOverViewTabValues } from "./TaskOverviewTabs";
import * as models from "../../../models";

const useStyles = makeStyles((theme: Theme) => ({
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

type TaskOverviewProps = {
    taskId: string;
};

const TaskOverview: React.FC<TaskOverviewProps> = ({ taskId }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const [activeTab, setActiveTab] = React.useState(
        TaskOverViewTabValues.OVERVIEW
    );

    return (
        <Container className={classes.root}>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <TaskOverViewTabs
                        onChange={(tab) => setActiveTab(tab)}
                        selectedTab={activeTab}
                    />
                </Grid>
                <Grid item>
                    <Grid container direction="row" spacing={isSm ? 1 : 3}>
                        <Grid item className={classes.item}>
                            <Stack direction={"column"} spacing={isSm ? 1 : 3}>
                                <TaskDetailsPanel taskId={taskId} />
                                <TaskActions taskId={taskId} />
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
                                <DeliverableDetails taskId={taskId} />
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
                </Grid>
            </Grid>
        </Container>
    );
};

export default TaskOverview;
