import React, { useRef, useState, useEffect } from "react";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { useDispatch, useSelector } from "react-redux";
import {
    dashboardFilteredUserSelector,
    dataStoreReadyStatusSelector,
    getRoleView,
    getWhoami,
} from "../../../redux/Selectors";
import { tasksStatus, userRoles } from "../../../apiConsts";
import { convertListDataToObject } from "../../../utilities";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
// disable horizontal scrollbar
import "./hideActiveRiderChipsScrollBar.css";
import _ from "lodash";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import UserChip from "../../../components/UserChip";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { setDashboardFilteredUser } from "../../../redux/Actions";
import moment from "moment";

// use for transparency on arrows sometime
const useStyles = makeStyles((theme) => ({
    dots: () => {
        const background =
            theme.palette.mode === "dark"
                ? "radial-gradient(circle, rgba(64,64,64,1) 30%, rgba(0,0,0,0) 100%)"
                : `radial-gradient(circle, ${theme.palette.background.paper} 30%, rgba(0,0,0,0) 100%)`;
        return {
            background: background,
            width: 300,
            height: 100,
            borderRadius: "1em",
            position: "absolute",
            bottom: 4,
            right: 4,
            display: "none",
            zIndex: 90,
        };
    },
}));

function LeftArrow() {
    const { isFirstItemVisible, isLastItemVisible, scrollPrev } =
        React.useContext(VisibilityContext);

    if (isFirstItemVisible && isLastItemVisible) {
        return null;
    }

    return (
        <IconButton disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
            <ArrowBackIosIcon>Left</ArrowBackIosIcon>
        </IconButton>
    );
}

function RightArrow() {
    const { isLastItemVisible, isFirstItemVisible, scrollNext } =
        React.useContext(VisibilityContext);

    if (isFirstItemVisible && isLastItemVisible) {
        return null;
    }
    return (
        <IconButton disabled={isLastItemVisible} onClick={() => scrollNext()}>
            <ArrowForwardIosIcon sx={{ height: "100%" }}>
                Right
            </ArrowForwardIosIcon>
        </IconButton>
    );
}

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

function ActiveRidersChips() {
    const [activeRiders, setActiveRiders] = useState({});
    const [errorState, setErrorState] = useState(null);
    const whoami = useSelector(getWhoami);
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const timeSet = useRef(null);
    const assignmentsObserver = useRef({ unsubscribe: () => {} });
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const animate = useRef(false);
    const roleView = useSelector(getRoleView);
    const dashboardFilteredUserRef = useRef(null);
    dashboardFilteredUserRef.current = dashboardFilteredUser;

    const dispatch = useDispatch();

    async function calculateRidersStatus() {
        let activeRidersResult = [];
        if (roleView === "ALL") {
            const assignments = await DataStore.query(
                models.TaskAssignee,
                (a) => a.role("eq", userRoles.rider)
            );
            activeRidersResult = assignments
                .filter(olderThanOneWeek)
                .map((a) => a.assignee);
        } else if (roleView === userRoles.coordinator && whoami) {
            const riderAssignments = await DataStore.query(
                models.TaskAssignee,
                (a) => a.role("eq", userRoles.rider)
            );
            const coordAssignments = await DataStore.query(
                models.TaskAssignee,
                (a) => a.role("eq", userRoles.coordinator)
            );
            const myAssignments = coordAssignments.filter(
                (a) => a.assignee && a.assignee.id === whoami.id
            );
            const myAssignedTasksIds = myAssignments.map(
                (a) => a.task && a.task.id
            );
            // find which tasks assigned to me are assigned to the rider
            const assignedToMeRiders = riderAssignments.filter(
                (a) =>
                    a.assignee &&
                    a.task &&
                    myAssignedTasksIds.includes(a.task.id)
            );
            activeRidersResult = assignedToMeRiders
                .filter(olderThanOneWeek)
                .map((a) => a.assignee);
        }
        if (
            dashboardFilteredUserRef.current &&
            !activeRidersResult
                .map((u) => u.id)
                .includes(dashboardFilteredUserRef.current)
        ) {
            dispatch(setDashboardFilteredUser(null));
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

    async function updateRiderHome(userId) {
        try {
            const allRiderAssignedTasks = (
                await DataStore.query(models.TaskAssignee, (a) =>
                    a.role("eq", userRoles.rider)
                )
            ).filter((a) => a.assignee && a.assignee.id === userId);
            const tasksToUpdate = allRiderAssignedTasks
                .map((a) => a.task)
                .filter((t) => t.status === tasksStatus.droppedOff);
            // for every task in the list, update the task status to completed
            for (const task of tasksToUpdate) {
                await DataStore.save(
                    models.Task.copyOf(task, (updated) => {
                        updated.status = tasksStatus.completed;
                        updated.timeRiderHome = timeSet.current.toISOString();
                    })
                );
            }
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification("Sorry, an error occurred"));
        }
    }

    if (errorState) {
        return <Typography>Sorry, something went wrong.</Typography>;
    }
    return (
        <React.Fragment>
            <ScrollMenu
                alignItems="center"
                LeftArrow={
                    !activeRiders || _.isEmpty(activeRiders) ? null : LeftArrow
                }
                RightArrow={
                    !activeRiders || _.isEmpty(activeRiders) ? null : RightArrow
                }
            >
                <Box sx={{ margin: 0.5 }}>
                    <Chip
                        label="All"
                        onClick={() => dispatch(setDashboardFilteredUser(null))}
                        variant={
                            dashboardFilteredUser === null
                                ? "default"
                                : "outlined"
                        }
                    />
                </Box>
                {Object.values(activeRiders).map((rider) => {
                    return (
                        <Box
                            itemId={rider.id}
                            sx={{ margin: 0.5 }}
                            key={rider.id}
                        >
                            <UserChip
                                onClick={() => {
                                    if (dashboardFilteredUser === rider.id) {
                                        dispatch(
                                            setDashboardFilteredUser(null)
                                        );
                                    } else {
                                        dispatch(
                                            setDashboardFilteredUser(rider.id)
                                        );
                                    }
                                }}
                                color={
                                    dashboardFilteredUser === rider.id
                                        ? "primary"
                                        : "default"
                                }
                                variant={
                                    dashboardFilteredUser === rider.id
                                        ? "default"
                                        : "outlined"
                                }
                                user={rider}
                            />
                        </Box>
                    );
                })}
            </ScrollMenu>
        </React.Fragment>
    );
}

export default ActiveRidersChips;
