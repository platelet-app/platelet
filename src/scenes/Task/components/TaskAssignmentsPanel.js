import React, { useEffect, useRef, useState } from "react";
import { Button, Stack, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AssigneeEditPopover from "./AssigneeEditPopover";
import AvatarGroup from "@mui/material/AvatarGroup";
import UserAvatar from "../../../components/UserAvatar";
import AssignRiderCoordinatorPopover from "./AssignRiderCoordinatorPopover";
import makeStyles from "@mui/styles/makeStyles";
import { showHide } from "../../../styles/common";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { Paper } from "@mui/material";
import { userRoles } from "../../../apiConsts";
import RiderPicker from "../../../components/RiderPicker";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import UserRoleSelect from "../../../components/UserRoleSelect";
import { EditModeToggleButton } from "../../../components/EditModeToggleButton";

export const useStyles = makeStyles(() => ({
    italic: {
        fontStyle: "italic",
    },
}));

function TaskAssignmentsPanel(props) {
    const { task } = props;
    const [editMode, setEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [assignedRiders, setAssignedRiders] = useState([]);
    const [assignedCoordinators, setAssignedCoordinators] = useState([]);
    const [assignedRidersDisplayString, setAssignedRidersDisplayString] =
        useState("");
    const [
        assignedCoordinatorsDisplayString,
        setAssignedCoordinatorsDisplayString,
    ] = useState("");
    const cardClasses = dialogCardStyles();
    const { show, hide } = showHide();
    const [role, setRole] = useState(userRoles.rider);

    function onSelect(value) {
        if (value) props.onSelect(value, role);
        clearEditMode();
    }

    function clearEditMode() {
        setEditMode(false);
        setSelectedUser(null);
        setRole(userRoles.rider);
    }

    function sortAssignees() {
        if (task.assignees && Object.values(task.assignees).length > 0) {
            const riders = Object.values(task.assignees)
                .filter((assignment) => assignment.role === userRoles.rider)
                .map((a) => a.assignee);
            setAssignedRidersDisplayString(
                riders.map((u) => u.displayName).join(", ")
            );
            setAssignedRiders(riders);
            const coordinators = Object.values(task.assignees)
                .filter(
                    (assignment) => assignment.role === userRoles.coordinator
                )
                .map((a) => a.assignee);

            setAssignedCoordinatorsDisplayString(
                coordinators.map((u) => u.displayName).join(", ")
            );
            setAssignedCoordinators(coordinators);
        }
    }

    useEffect(sortAssignees, [props.task]);

    const assigneeSelector = editMode ? (
        <Stack directon={"column"} spacing={1}>
            <UserRoleSelect
                value={role}
                onSelect={(value) => setRole(value)}
                exclude={Object.values(userRoles).filter(
                    (value) =>
                        ![userRoles.rider, userRoles.coordinator].includes(
                            value
                        )
                )}
            />
            {role === userRoles.rider ? (
                <RiderPicker
                    onSelect={onSelect}
                    exclude={assignedRiders.map((u) => u.id)}
                />
            ) : (
                <CoordinatorPicker
                    onSelect={onSelect}
                    exclude={assignedCoordinators.map((u) => u.id)}
                />
            )}
            <Button onClick={clearEditMode}>Cancel</Button>
        </Stack>
    ) : (
        <></>
    );

    return (
        <Paper className={cardClasses.root}>
            <Grid container spacing={3} direction={"column"}>
                <Grid item>
                    <EditModeToggleButton
                        tooltipDefault={"Edit assignees"}
                        value={editMode}
                        onChange={(v) => {
                            setEditMode(v);
                        }}
                    />
                </Grid>
                <Grid item>
                    <Stack
                        alignItems="center"
                        justifyContent="space-between"
                        direction="row"
                    >
                        <Typography>Coordinators:</Typography>
                        <Tooltip title={assignedCoordinatorsDisplayString}>
                            <AvatarGroup>
                                {assignedCoordinators.map((u) => (
                                    <UserAvatar
                                        key={u.id}
                                        size={5}
                                        userUUID={u.id}
                                        displayName={u.displayName}
                                        avatarURL={u.profilePictureThumbnailURL}
                                    />
                                ))}
                            </AvatarGroup>
                        </Tooltip>
                    </Stack>
                </Grid>
                <Grid item>
                    <Stack
                        alignItems="center"
                        justifyContent="space-between"
                        direction="row"
                    >
                        <Typography>Riders:</Typography>
                        <Tooltip title={assignedRidersDisplayString}>
                            <AvatarGroup>
                                {assignedRiders.map((u) => (
                                    <UserAvatar
                                        key={u.id}
                                        size={5}
                                        userUUID={u.id}
                                        displayName={u.displayName}
                                        avatarURL={u.profilePictureThumbnailURL}
                                    />
                                ))}
                            </AvatarGroup>
                        </Tooltip>
                    </Stack>
                </Grid>
                <Grid item>{assigneeSelector}</Grid>
            </Grid>
        </Paper>
    );

    return (
        <Paper className={cardClasses.root}>
            <Grid
                container
                justifyContent={"center"}
                direction={"column"}
                spacing={3}
            >
                <Grid item>
                    <Grid
                        container
                        alignItems={"center"}
                        direction={"row"}
                        spacing={1}
                        justifyContent={"space-between"}
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
                                        title={assignedRidersDisplayString}
                                    >
                                        <AvatarGroup>
                                            {assignedRiders.map((u) => (
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
            </Grid>
        </Paper>
    );
}

export default TaskAssignmentsPanel;
