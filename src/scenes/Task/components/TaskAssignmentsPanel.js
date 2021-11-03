import React, { useEffect, useState } from "react";
import { Button, Paper, Stack, Tooltip } from "@mui/material";
import AvatarGroup from "@mui/material/AvatarGroup";
import makeStyles from "@mui/styles/makeStyles";
import { userRoles } from "../../../apiConsts";
import RiderPicker from "../../../components/RiderPicker";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import UserRoleSelect from "../../../components/UserRoleSelect";
import { EditModeToggleButton } from "../../../components/EditModeToggleButton";
import TaskAssignees from "./TaskAssignees";
import UserAvatar from "../../../components/UserAvatar";

export const useStyles = makeStyles(() => ({
    italic: {
        fontStyle: "italic",
    },
}));

function TaskAssignmentsPanel(props) {
    const { task } = props;
    const [editMode, setEditMode] = useState(false);
    const [assignedRiders, setAssignedRiders] = useState([]);
    const [assignedCoordinators, setAssignedCoordinators] = useState([]);
    const [assigneesDisplayString, setAssigneesDisplayString] = useState(null);
    const [role, setRole] = useState(userRoles.rider);

    function onSelect(value) {
        if (value) props.onSelect(value, role);
        clearEditMode();
    }

    function clearEditMode() {
        setEditMode(false);
        setRole(userRoles.rider);
    }

    useEffect(() => setEditMode(assignedRiders.length === 0), [assignedRiders]);

    function sortAssignees() {
        if (
            props.task.assignees &&
            Object.values(props.task.assignees).length > 0
        ) {
            const riders = Object.values(props.task.assignees)
                .filter((assignment) => assignment.role === userRoles.rider)
                .map((a) => a.assignee);
            setAssignedRiders(riders);
            const coordinators = Object.values(task.assignees)
                .filter(
                    (assignment) => assignment.role === userRoles.coordinator
                )
                .map((a) => a.assignee);

            setAssignedCoordinators(coordinators);
            setAssigneesDisplayString(
                [...coordinators, ...riders]
                    .map((u) => u.displayName)
                    .join(", ")
            );
        } else {
            setAssignedCoordinators([]);
            setAssignedRiders([]);
            setAssigneesDisplayString(null);
        }
    }

    useEffect(sortAssignees, [props.task.assignees]);

    const assigneeSelector = editMode ? (
        <Stack direction={"column"} spacing={1}>
            <TaskAssignees
                onRemove={props.onDelete}
                assignees={task.assignees ? Object.values(task.assignees) : []}
            />
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
        <Paper sx={{ padding: 1 }}>
            <Stack direction="column" spacing={2}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent={"space-between"}
                >
                    <Tooltip title={assigneesDisplayString}>
                        <AvatarGroup>
                            {[...assignedCoordinators, ...assignedRiders].map(
                                (u) => (
                                    <UserAvatar
                                        size={4}
                                        userUUID={u.id}
                                        displayName={u.displayName}
                                        avatarURL={u.profilePictureThumbnailURL}
                                    />
                                )
                            )}
                        </AvatarGroup>
                    </Tooltip>
                    <EditModeToggleButton
                        tooltipDefault={"Edit assignees"}
                        value={editMode}
                        onChange={(v) => {
                            setEditMode(v);
                        }}
                    />
                </Stack>
                {assigneeSelector}
            </Stack>
        </Paper>
    );
}

export default TaskAssignmentsPanel;
