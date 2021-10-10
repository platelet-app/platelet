import React from "react";
import { Tooltip } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AssigneeEditPopover from "./AssigneeEditPopover";
import AvatarGroup from '@mui/material/AvatarGroup';
import UserAvatar from "../../../components/UserAvatar";
import AssignRiderCoordinatorPopover from "./AssignRiderCoordinatorPopover";
import { makeStyles } from "@material-ui/core";
import { showHide } from "../../../styles/common";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { Paper } from "@material-ui/core";
import { getActiveTaskSelector } from "../../../redux/Selectors";
import { useSelector } from "react-redux";

export const useStyles = makeStyles(() => ({
    italic: {
        fontStyle: "italic",
    },
}));

function TaskAssignmentsPanel() {
    const task = useSelector(getActiveTaskSelector);
    const classes = useStyles();
    const cardClasses = dialogCardStyles();
    const { show, hide } = showHide();
    return (
        <Paper className={cardClasses.root}>
            <Grid container justify={"center"} direction={"column"} spacing={3}>
                <Grid item>
                    <Grid
                        container
                        alignItems={"center"}
                        direction={"row"}
                        spacing={1}
                        justify={"space-between"}
                    >
                        <Grid item>
                            <Typography>Riders:</Typography>
                        </Grid>
                        <Grid item>
                            <Grid
                                container
                                alignItems={"center"}
                                spacing={1}
                                direction={"row"}
                            >
                                <Grid item>
                                    <AssigneeEditPopover
                                        rider
                                        assignees={task.assigned_riders}
                                        className={
                                            task.assigned_riders.length > 0
                                                ? show
                                                : hide
                                        }
                                        taskUUID={task.uuid}
                                    />
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        title={
                                            task.assigned_riders_display_string
                                        }
                                    >
                                        <AvatarGroup>
                                            {task.assigned_riders.map((u) => (
                                                <UserAvatar
                                                    key={u.uuid}
                                                    size={5}
                                                    userUUID={u.uuid}
                                                    displayName={u.display_name}
                                                    avatarURL={
                                                        u.profile_picture_thumbnail_url
                                                    }
                                                />
                                            ))}
                                        </AvatarGroup>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <AssignRiderCoordinatorPopover
                                        rider
                                        exclude={task.assigned_riders.map(
                                            (u) => u.uuid
                                        )}
                                        taskUUID={task.uuid}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid
                        container
                        alignItems={"center"}
                        direction={"row"}
                        spacing={1}
                        justify={"space-between"}
                    >
                        <Grid item>
                            <Typography>Coordinators:</Typography>
                        </Grid>
                        <Grid item>
                            <Grid
                                container
                                alignItems={"center"}
                                spacing={1}
                                direction={"row"}
                            >
                                <Grid item>
                                    <AssigneeEditPopover
                                        coordinator
                                        assignees={task.assigned_coordinators}
                                        className={
                                            task.assigned_coordinators.length >
                                            0
                                                ? show
                                                : hide
                                        }
                                        taskUUID={task.uuid}
                                    />
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        title={
                                            task.assigned_coordinators_display_string
                                        }
                                    >
                                        <AvatarGroup>
                                            {task.assigned_coordinators.map(
                                                (u) => (
                                                    <UserAvatar
                                                        key={u.uuid}
                                                        size={5}
                                                        userUUID={u.uuid}
                                                        displayName={
                                                            u.display_name
                                                        }
                                                        avatarURL={
                                                            u.profile_picture_thumbnail_url
                                                        }
                                                    />
                                                )
                                            )}
                                        </AvatarGroup>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <AssignRiderCoordinatorPopover
                                        exclude={task.assigned_coordinators.map(
                                            (u) => u.uuid
                                        )}
                                        coordinator
                                        taskUUID={task.uuid}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default TaskAssignmentsPanel;
