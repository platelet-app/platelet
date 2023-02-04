import React, { useRef, useState, useEffect } from "react";
import * as models from "../models";
import { useSelector } from "react-redux";
import { getRoleView, getWhoami } from "../redux/Selectors";
import { Grid, Typography } from "@mui/material";
import _ from "lodash";
import UserChip from "./UserChip";
import useRoleAssignments from "../hooks/useRoleAssignments";

type RecentlyAssignedUsersProps = {
    role?: models.Role;
    value?: models.User;
    onChange?: (...args: any[]) => any;
    limit?: number;
    exclude?: string[];
    disabled?: boolean;
};

const RecentlyAssignedUsers: React.FC<RecentlyAssignedUsersProps> = ({
    role = models.Role.RIDER,
    value = null,
    onChange = () => {},
    limit = 10,
    exclude = [],
    disabled = false,
}) => {
    const [activeRiders, setActiveRiders] = useState<models.User[]>([]);
    const whoami = useSelector(getWhoami);
    const animate = useRef(false);
    const roleView = useSelector(getRoleView);
    const selectedId = value?.id;

    const { state, isFetching, error } = useRoleAssignments(
        role,
        [],
        roleView === models.Role.COORDINATOR ? whoami?.id : null
    );

    const calculateRidersStatus = React.useCallback(async () => {
        // filter out anyone who on longer has the role
        let activeRidersResult = state
            .map((a) => a.assignee)
            .filter((u) => u.roles && u.roles.includes(role));
        // remove duplicates and truncate to limit
        activeRidersResult = _.uniqBy(activeRidersResult, (u) => u.id);
        if (limit) {
            activeRidersResult = activeRidersResult.slice(0, limit);
        }
        return activeRidersResult;
    }, [state, role, limit]);

    const getActiveRiders = React.useCallback(async () => {
        setActiveRiders(await calculateRidersStatus());
        animate.current = true;
    }, [calculateRidersStatus]);

    useEffect(() => {
        getActiveRiders();
    }, [getActiveRiders]);

    if (error) {
        return <Typography>Sorry, something went wrong.</Typography>;
    } else {
        return (
            <Grid container data-testid="recent-assigned-users" direction="row">
                {activeRiders.map((rider) => {
                    if (exclude.includes(rider.id)) {
                        return <React.Fragment key={rider.id}></React.Fragment>;
                    } else {
                        return (
                            <Grid
                                item
                                sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                                key={rider.id}
                            >
                                <UserChip
                                    showResponsibility={
                                        role === models.Role.RIDER
                                    }
                                    disabled={isFetching || disabled}
                                    onClick={() => {
                                        if (selectedId === rider.id) {
                                            onChange(null);
                                        } else {
                                            onChange(rider);
                                        }
                                    }}
                                    color={
                                        selectedId === rider.id
                                            ? "primary"
                                            : undefined
                                    }
                                    variant={
                                        selectedId === rider.id
                                            ? "filled"
                                            : "outlined"
                                    }
                                    user={rider}
                                />
                            </Grid>
                        );
                    }
                })}
            </Grid>
        );
    }
};

export default RecentlyAssignedUsers;
