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
import { Box, Grid, Typography } from "@mui/material";
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
    const whoami = useSelector(getWhoami);
    const assignmentsObserver = useRef({ unsubscribe: () => {} });
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const animate = useRef(false);
    const roleView = useSelector(getRoleView);

    async function calculateRidersStatus() {
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
        if (
            props.value &&
            !activeRidersResult.map((u) => u.id).includes(props.value)
        ) {
            props.onChange(null);
        }
        // remove duplicates and truncate to limit
        activeRidersResult = _.uniqBy(activeRidersResult, (u) => u.id);
        if (props.limit) {
            activeRidersResult = activeRidersResult.slice(0, props.limit);
        }
        return convertListDataToObject(activeRidersResult);
    }

    // debounce the call in case multiple tasks are being updated at once
    const debouncedCalculateRidersStatus = _.debounce(
        async () => setActiveRiders(await calculateRidersStatus()),
        1000
    );

    async function getActiveRiders() {
        try {
            if (!dataStoreReadyStatus) return;
            setActiveRiders(await calculateRidersStatus());
            animate.current = true;
            assignmentsObserver.current.unsubscribe();
            assignmentsObserver.current = DataStore.observe(
                models.TaskAssignee
            ).subscribe(async (observeResult) => {
                if (["INSERT", "DELETE"].includes(observeResult.opType)) {
                    debouncedCalculateRidersStatus();
                }
            });
        } catch (error) {
            console.log(error);
            setErrorState(error);
        }
    }

    useEffect(() => {
        getActiveRiders();
    }, [dataStoreReadyStatus, roleView]);

    useEffect(
        () => () => {
            assignmentsObserver.current.unsubscribe();
        },
        []
    );

    if (errorState) {
        return <Typography>Sorry, something went wrong.</Typography>;
    } else {
        return (
            <Grid container spacing={1} direction="row">
                {Object.values(activeRiders).map((rider) => {
                    return (
                        <Grid item sx={{ margin: 0.5 }} key={rider.id}>
                            <UserChip
                                onClick={() => {
                                    if (props.value === rider.id) {
                                        props.onChange(null);
                                    } else {
                                        props.onChange(rider.id);
                                    }
                                }}
                                color={
                                    props.value === rider.id
                                        ? "primary"
                                        : "default"
                                }
                                variant={
                                    props.value === rider.id
                                        ? "default"
                                        : "outlined"
                                }
                                user={rider}
                            />
                        </Grid>
                    );
                })}
                ;
            </Grid>
        );
    }
}

RecentlyAssignedUsers.propTypes = {
    role: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    limit: PropTypes.number,
};

RecentlyAssignedUsers.defaultProps = {
    role: userRoles.rider,
    value: null,
    onChange: () => {},
    limit: 10,
};

export default RecentlyAssignedUsers;
