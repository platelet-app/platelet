import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { DataStore } from "aws-amplify";
import React, { useEffect, useState } from "react";
import * as models from "../../../models";
import { userRoles } from "../../../apiConsts";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import RecentlyAssignedUsers from "../../../components/RecentlyAssignedUsers";
import RiderPicker from "../../../components/RiderPicker";
import UserChip from "../../../components/UserChip";
import UserRoleSelect from "../../../components/UserRoleSelect";
import { useSelector } from "react-redux";
import {
    dashboardTabIndexSelector,
    selectedItemsSelector,
    taskAssigneesSelector,
} from "../../../redux/Selectors";

function MultipleSelectionActionsAssignUser(props) {
    const [role, setRole] = useState(userRoles.rider);
    const [state, setState] = useState({
        [userRoles.rider]: [],
        [userRoles.coordinator]: [],
    });

    const assignees = useSelector(taskAssigneesSelector);

    function onSelect(user) {
        setState((prevState) => ({
            ...prevState,
            [role]: [...prevState[role], user],
        }));
    }

    function handleRemoveUser(userId) {
        setState((prevState) => ({
            ...prevState,
            [role]: prevState[role].filter((user) => userId !== user.id),
        }));
    }

    function generateModels() {
        const riders = Object.values(props.selectedItems).map((task) => {
            return Object.values(state[userRoles.rider]).map((assignee) => {
                return new models.TaskAssignee({
                    assignee,
                    task,
                    role: userRoles.rider,
                });
            });
        });
        const coords = Object.values(props.selectedItems).map((task) => {
            return Object.values(state[userRoles.coordinator]).map(
                (assignee) =>
                    new models.TaskAssignee({
                        assignee,
                        task,
                        role: userRoles.coordinator,
                    })
            );
        });
        const result = [...riders, ...coords].flat(2);
        const filtered = result.filter((assignment) => {
            return !assignees.items.some((assignee) => {
                return (
                    assignment.task.id === assignee.task.id &&
                    assignment.assignee.id === assignee.assignee.id &&
                    assignment.role === assignee.role
                );
            });
        });
        props.onChange(filtered);
    }
    useEffect(generateModels, [state]);

    return (
        <Stack spacing={2} direction="column" divider={<Divider />}>
            <UserRoleSelect
                value={[role]}
                onSelect={(value) => setRole(value)}
                exclude={Object.values(userRoles).filter(
                    (value) =>
                        ![userRoles.rider, userRoles.coordinator].includes(
                            value
                        )
                )}
            />
            <Grid container spacing={1} direction={"row"}>
                {role === userRoles.rider &&
                    state[userRoles.rider].map((user) => {
                        return (
                            user && (
                                <Grid key={user.id} item>
                                    <UserChip
                                        onDelete={() =>
                                            handleRemoveUser(user.id)
                                        }
                                        user={user}
                                    />
                                </Grid>
                            )
                        );
                    })}
                {role === userRoles.coordinator &&
                    state[userRoles.coordinator].map((user) => {
                        return (
                            user && (
                                <Grid key={user.id} item>
                                    <UserChip
                                        onDelete={() =>
                                            handleRemoveUser(user.id)
                                        }
                                        user={user}
                                    />
                                </Grid>
                            )
                        );
                    })}
            </Grid>
            <RecentlyAssignedUsers
                onChange={onSelect}
                role={role}
                limit={5}
                exclude={state[role].map((u) => u.id)}
            />
            <Box sx={{ maxWidth: 400 }}>
                {role === userRoles.rider ? (
                    <RiderPicker
                        onSelect={onSelect}
                        exclude={state[userRoles.rider].map((u) => u.id)}
                    />
                ) : (
                    <CoordinatorPicker
                        onSelect={onSelect}
                        exclude={state[userRoles.coordinator].map((u) => u.id)}
                    />
                )}
            </Box>
        </Stack>
    );
}

export default MultipleSelectionActionsAssignUser;
