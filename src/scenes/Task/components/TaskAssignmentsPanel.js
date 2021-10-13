import React, { useEffect, useState } from "react";
import { Tooltip } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AssigneeEditPopover from "./AssigneeEditPopover";
import AvatarGroup from "@mui/material/AvatarGroup";
import UserAvatar from "../../../components/UserAvatar";
import AssignRiderCoordinatorPopover from "./AssignRiderCoordinatorPopover";
import { makeStyles } from "@material-ui/core";
import { showHide } from "../../../styles/common";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { Paper } from "@material-ui/core";
import { getActiveTaskSelector } from "../../../redux/Selectors";
import { useSelector } from "react-redux";
import { userRoles } from "../../../apiConsts";

export const useStyles = makeStyles(() => ({
    italic: {
        fontStyle: "italic",
    },
}));

function TaskAssignmentsPanel(props) {
    const { task } = props;

    const [assignedRiders, setAssignedRiders] = useState([]);
    const [assignedCoordinators, setAssignedCoordinators] = useState([]);
    const cardClasses = dialogCardStyles();
    const { show, hide } = showHide();

    function sortAssignees() {
        console.log(task.assignees);
        if (task.assignees && Object.values(task.assignees).length > 0) {
            const riders = Object.values(task.assignees).filter(
                (assignment) => assignment.role === userRoles.rider
            );
            setAssignedRiders(riders);
            const coordinators = Object.values(task.assignees).filter(
                (assignment) => assignment.role === userRoles.coordinator
            );
            setAssignedCoordinators(coordinators);
        }
    }

    useEffect(sortAssignees, [props.task]);
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
                                        assignees={assignedRiders}
                                        className={
                                            assignedRiders &&
                                            assignedRiders.length > 0
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
                                            {assignedRiders.map((u) => (
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
                                        onSelect={props.onSelect}
                                        exclude={assignedRiders.map(
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
                                        assignees={assignedCoordinators}
                                        className={
                                            assignedCoordinators &&
                                            assignedCoordinators.length > 0
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
                                            {assignedCoordinators.map((u) => (
                                                <UserAvatar
                                                    key={u.id}
                                                    size={5}
                                                    userUUID={u.id}
                                                    displayName={u.displayName}
                                                    avatarURL={
                                                        u.profilePictureThumbnailURL
                                                    }
                                                />
                                            ))}
                                        </AvatarGroup>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <AssignRiderCoordinatorPopover
                                        exclude={assignedCoordinators.map(
                                            (u) => u.id
                                        )}
                                        coordinator
                                        taskUUID={task.id}
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
