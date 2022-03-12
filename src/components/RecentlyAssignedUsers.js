import React, { useRef, useState, useEffect } from "react";
import { DataStore } from "aws-amplify";
import * as models from "../models";
import { useSelector } from "react-redux";
import {
    dataStoreReadyStatusSelector,
    getRoleView,
    getWhoami,
} from "../redux/Selectors";
import { tasksStatus, userRoles } from "../apiConsts";
import { convertListDataToObject } from "../utilities";
import { Grid, Typography } from "@mui/material";
import _ from "lodash";
import UserChip from "./UserChip";
import moment from "moment";
import PropTypes from "prop-types";

const olderThanOneWeek = (assignment) => {
    // if the job is in completed tab then only find out riders from the last week
    // to mimic the dashboard
    if (
        assignment.task &&
        [
            tasksStatus.completed,
            tasksStatus.droppedOff,
            tasksStatus.rejected,
            tasksStatus.cancelled,
        ].includes(assignment.task.status)
    ) {
        return moment(assignment.task.createdAt).isAfter(
            moment().subtract(1, "week")
        );
    } else {
        return true;
    }
};

function RecentlyAssignedUsers(props) {
    const [activeRiders, setActiveRiders] = useState({});
    const [errorState, setErrorState] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const whoami = useSelector(getWhoami);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const animate = useRef(false);
    const roleView = useSelector(getRoleView);

    const selectedId = props.value && props.value.id;

    async function calculateRidersStatus() {
        setIsFetching(true);
        let activeRidersResult = [];
        if (roleView === "ALL") {
            const assignments = await DataStore.query(
                models.TaskAssignee,
                (a) => a.role("eq", props.role),
                { limit: 100, sort: (s) => s.createdAt("desc") }
            );
            activeRidersResult = assignments.map((a) => a.assignee);
        } else if (roleView === userRoles.coordinator && whoami) {
            const theirAssignments = await DataStore.query(
                models.TaskAssignee,
                (a) => a.role("eq", props.role),
                { limit: 100, sort: (s) => s.createdAt("desc") }
            );

            let coordAssignments = theirAssignments;

            if (props.role === userRoles.rider) {
                coordAssignments = await DataStore.query(
                    models.TaskAssignee,
                    (a) => a.role("eq", userRoles.coordinator),
                    { limit: 100, sort: (s) => s.createdAt("desc") }
                );
            }
            const myAssignments = coordAssignments.filter(
                (a) => a.assignee && a.assignee.id === whoami.id
            );
            const myAssignedTasksIds = myAssignments.map(
                (a) => a.task && a.task.id
            );
            // find which tasks assigned to me are assigned to the rider
            const assignedToMeUsers = theirAssignments.filter(
                (a) =>
                    a.assignee &&
                    a.task &&
                    myAssignedTasksIds.includes(a.task.id)
            );
            activeRidersResult = assignedToMeUsers.map((a) => a.assignee);
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
            if (!dataStoreReadyStatus) return;
            setActiveRiders(await calculateRidersStatus());
            animate.current = true;
        } catch (error) {
            console.log(error);
            setErrorState(error);
        }
    }

    useEffect(() => {
        getActiveRiders();
    }, [dataStoreReadyStatus, roleView, props.role]);

    if (errorState) {
        return <Typography>Sorry, something went wrong.</Typography>;
    } else {
        return (
            <Grid container direction="row">
                {Object.values(activeRiders).map((rider) => {
                    if (props.exclude.includes(rider.id)) {
                        return <></>;
                    } else {
                        return (
                            <Grid
                                item
                                sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                                key={rider.id}
                            >
                                <UserChip
                                    showResponsibility
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
