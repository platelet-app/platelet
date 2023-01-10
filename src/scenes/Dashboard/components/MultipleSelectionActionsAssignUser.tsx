import { Box, Divider, Grid, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import RecentlyAssignedUsers from "../../../components/RecentlyAssignedUsers";
import RiderPicker from "../../../components/RiderPicker";
import UserChip from "../../../components/UserChip";
import UserRoleSelect from "../../../components/UserRoleSelect";
import _ from "lodash";
import * as models from "../../../models";

type MultipleSelectionActionsAssignUserProps = {
    onChange: (...args: any[]) => any;
};

type IStateInterface = {
    [models.Role.RIDER]: models.User[];
    [models.Role.COORDINATOR]: models.User[];
};

const MultipleSelectionActionsAssignUser: React.FC<MultipleSelectionActionsAssignUserProps> =
    ({ onChange }) => {
        const [role, setRole] = useState<
            models.Role.RIDER | models.Role.COORDINATOR
        >(models.Role.RIDER);
        const [state, setState] = useState<IStateInterface>({
            [models.Role.RIDER]: [],
            [models.Role.COORDINATOR]: [],
        });

        useEffect(() => {
            if (
                _.isEmpty(state[models.Role.COORDINATOR]) &&
                _.isEmpty(state[models.Role.RIDER])
            ) {
                onChange(null);
            } else {
                onChange(state);
            }
        }, [state, onChange]);

        function onSelect(user: models.User) {
            setState((prevState) => ({
                ...prevState,
                [role]: [...prevState[role], user],
            }));
        }

        function handleRemoveUser(userId: string) {
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
                    exclude={Object.values(models.Role).filter(
                        (value) =>
                            ![
                                models.Role.RIDER,
                                models.Role.COORDINATOR,
                            ].includes(value)
                    )}
                />
                <Stack
                    spacing={1}
                    direction={
                        role === models.Role.RIDER ? "column" : "column-reverse"
                    }
                >
                    <div>
                        <Grid container spacing={1} direction={"row"}>
                            {state[models.Role.RIDER].map((user) => {
                                return (
                                    user && (
                                        <Grid key={user.id} item>
                                            <UserChip
                                                showResponsibility
                                                disabled={
                                                    role !== models.Role.RIDER
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
                    {!!state[models.Role.RIDER].length &&
                        !!state[models.Role.COORDINATOR].length && <Divider />}
                    <div>
                        <Grid container spacing={1} direction={"row"}>
                            {state[models.Role.COORDINATOR].map((user) => {
                                return (
                                    user && (
                                        <Grid key={user.id} item>
                                            <UserChip
                                                disabled={
                                                    role !==
                                                    models.Role.COORDINATOR
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
                    {role === models.Role.RIDER ? (
                        <RiderPicker
                            onSelect={onSelect}
                            exclude={state[models.Role.RIDER].map((u) => u.id)}
                        />
                    ) : (
                        <CoordinatorPicker
                            onSelect={onSelect}
                            exclude={state[models.Role.COORDINATOR].map(
                                (u) => u.id
                            )}
                        />
                    )}
                </Box>
            </Stack>
        );
    };

MultipleSelectionActionsAssignUser.defaultProps = {
    onChange: () => {},
};

export default MultipleSelectionActionsAssignUser;
