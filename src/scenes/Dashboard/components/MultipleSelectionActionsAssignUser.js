import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { userRoles } from "../../../apiConsts";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import RecentlyAssignedUsers from "../../../components/RecentlyAssignedUsers";
import RiderPicker from "../../../components/RiderPicker";
import UserChip from "../../../components/UserChip";
import UserRoleSelect from "../../../components/UserRoleSelect";
import _ from "lodash";

function MultipleSelectionActionsAssignUser({ onChange }) {
    const [role, setRole] = useState(userRoles.rider);
    const [state, setState] = useState({
        [userRoles.rider]: [],
        [userRoles.coordinator]: [],
    });

    useEffect(() => {
        if (
            _.isEmpty(state[userRoles.coordinator]) &&
            _.isEmpty(state[userRoles.rider])
        ) {
            onChange(null);
        } else {
            onChange(state);
        }
    }, [state, onChange]);

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
            <Stack
                spacing={1}
                direction={
                    role === userRoles.rider ? "column" : "column-reverse"
                }
            >
                <div>
                    <Grid container spacing={1} direction={"row"}>
                        {state[userRoles.rider].map((user) => {
                            return (
                                user && (
                                    <Grid key={user.id} item>
                                        <UserChip
                                            showResponsibility
                                            disabled={role !== userRoles.rider}
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
                </div>
                {!!state[userRoles.rider].length &&
                    !!state[userRoles.coordinator].length && <Divider />}
                <div>
                    <Grid container spacing={1} direction={"row"}>
                        {state[userRoles.coordinator].map((user) => {
                            return (
                                user && (
                                    <Grid key={user.id} item>
                                        <UserChip
                                            disabled={
                                                role !== userRoles.coordinator
                                            }
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
                </div>
            </Stack>
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

MultipleSelectionActionsAssignUser.propTypes = {
    selectedItems: PropTypes.object,
    onChange: PropTypes.func,
    onReady: PropTypes.func,
};

MultipleSelectionActionsAssignUser.defaultProps = {
    selectedItems: [],
    onChange: () => {},
    onReady: () => {},
};

export default MultipleSelectionActionsAssignUser;
