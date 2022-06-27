import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    getRoleView,
    getWhoami,
    taskAssigneesReadyStatusSelector,
    taskAssigneesSelector,
} from "../redux/Selectors";
import { userRoles } from "../apiConsts";
import { convertListDataToObject } from "../utilities";
import { Grid, Typography } from "@mui/material";
import _ from "lodash";
import UserChip from "./UserChip";
import PropTypes from "prop-types";

function RecentlyAssignedUsers(props) {
    const [activeRiders, setActiveRiders] = useState({});
    const [errorState, setErrorState] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const allAssignees = useSelector(taskAssigneesSelector).items;
    const allAssigneesReady = useSelector(taskAssigneesReadyStatusSelector);
    const whoami = useSelector(getWhoami);
    const animate = useRef(false);
    const roleView = useSelector(getRoleView);

    const selectedId = props.value && props.value.id;

    async function calculateRidersStatus() {
        setIsFetching(true);
        let activeRidersResult = [];
        if (roleView === "ALL") {
            const assignments = allAssignees.filter(
                (a) => a.role === props.role
            );
            // filter out those who no longer have the role
            activeRidersResult = assignments
                .map((a) => a.assignee)
                .filter((u) => u.roles && u.roles.includes(props.role));
        } else if (whoami) {
            const myAssignments = allAssignees.filter(
                (a) =>
                    a.role === roleView &&
                    a.assignee &&
                    a.assignee.id === whoami.id
            );
            const myAssignedTasksIds = myAssignments.map(
                (a) => a.task && a.task.id
            );
            // find which tasks assigned to me are assigned to the rider
            const assignedToMeUsers = allAssignees.filter(
                (a) =>
                    a.role === props.role &&
                    a.assignee &&
                    a.task &&
                    myAssignedTasksIds.includes(a.task.id)
            );
            // filter out those who no longer have the role
            activeRidersResult = assignedToMeUsers
                .map((a) => a.assignee)
                .filter((u) => u.roles && u.roles.includes(props.role));
        }
        // remove duplicates and truncate to limit
        activeRidersResult = _.uniqBy(activeRidersResult, (u) => u.id);
        if (props.limit) {
            activeRidersResult = activeRidersResult.slice(0, props.limit);
        }
        setIsFetching(false);
        return convertListDataToObject(activeRidersResult);
    }

    async function getActiveRiders() {
        try {
            if (!roleView) return;
            setActiveRiders(await calculateRidersStatus());
            animate.current = true;
        } catch (error) {
            console.log(error);
            setErrorState(error);
        }
    }

    useEffect(() => {
        getActiveRiders();
    }, [roleView, props.role, allAssigneesReady]);

    if (errorState) {
        return <Typography>Sorry, something went wrong.</Typography>;
    } else {
        return (
            <Grid container direction="row">
                {Object.values(activeRiders).map((rider) => {
                    if (props.exclude.includes(rider.id)) {
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
                                        props.role === userRoles.rider
                                    }
                                    disabled={isFetching || props.disabled}
                                    onClick={() => {
                                        if (selectedId === rider.id) {
                                            props.onChange(null);
                                        } else {
                                            props.onChange(rider);
                                        }
                                    }}
                                    color={
                                        selectedId === rider.id
                                            ? "primary"
                                            : "default"
                                    }
                                    variant={
                                        selectedId === rider.id
                                            ? "default"
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
}

RecentlyAssignedUsers.propTypes = {
    role: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
    limit: PropTypes.number,
    exclude: PropTypes.array,
    disabled: PropTypes.bool,
};

RecentlyAssignedUsers.defaultProps = {
    role: userRoles.rider,
    value: null,
    onChange: () => {},
    limit: 10,
    exclude: [],
    disabled: false,
};

export default RecentlyAssignedUsers;
