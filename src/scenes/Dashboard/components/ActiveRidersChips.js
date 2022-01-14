import React, { useRef, useState, useEffect } from "react";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { useSelector } from "react-redux";
import {
    dataStoreReadyStatusSelector,
    getRoleView,
} from "../../../redux/Selectors";
import { tasksStatus, userRoles } from "../../../apiConsts";
import { convertListDataToObject } from "../../../utilities";
import { Avatar, Box, Chip, IconButton, Stack } from "@mui/material";
import { makeStyles } from "@mui/styles";
// disable horizontal scrollbar
import "./hideActiveRiderChipsScrollBar.css";
import _ from "lodash";
import RiderConfirmationHomeContents from "./RiderConfirmationHomeContents";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import UserChip from "../../../components/UserChip";

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

function ActiveRidersChips() {
    const [activeRiders, setActiveRiders] = useState({});
    const [updatingRider, setUpdatingRider] = useState(null);
    const timeSet = useRef(null);
    const tasksObserver = useRef({ unsubscribe: () => {} });
    const assignmentsObserver = useRef({ unsubscribe: () => {} });
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const animate = useRef(false);
    const roleView = useSelector(getRoleView);

    async function calculateRidersStatus() {
        const assignments = await DataStore.query(models.TaskAssignee, (a) =>
            a.role("eq", userRoles.rider)
        );
        const activeRidersFiltered = assignments
            .filter(
                (assignment) =>
                    assignment.task &&
                    ![
                        tasksStatus.completed,
                        tasksStatus.rejected,
                        tasksStatus.cancelled,
                    ].includes(assignment.task.status)
            )
            .map((a) => a.assignee);
        return convertListDataToObject(activeRidersFiltered);
    }

    // debounce the call because multiple tasks are being updated at once
    const debouncedCalculateRidersStatus = _.debounce(
        async () => setActiveRiders(await calculateRidersStatus()),
        1000
    );

    async function getActiveRiders() {
        if (!dataStoreReadyStatus) return;
        setActiveRiders(await calculateRidersStatus());
        tasksObserver.current.unsubscribe();
        tasksObserver.current = DataStore.observe(models.Task).subscribe(
            async (observeResult) => {
                const task = observeResult.element;
                if (
                    [
                        tasksStatus.cancelled,
                        tasksStatus.rejected,
                        tasksStatus.completed,
                    ].includes(task.status)
                ) {
                    debouncedCalculateRidersStatus();
                }
            }
        );
        animate.current = true;
        assignmentsObserver.current.unsubscribe();
        assignmentsObserver.current = DataStore.observe(
            models.TaskAssignee
        ).subscribe(async (observeResult) => {
            const taskAssigneeData = observeResult.element;
            if (observeResult.opType === "INSERT") {
                const task = await DataStore.query(
                    models.Task,
                    taskAssigneeData.taskId
                );
                const user = await DataStore.query(
                    models.User,
                    taskAssigneeData.assigneeId
                );
                if (
                    task &&
                    taskAssigneeData.role === userRoles.rider &&
                    ![
                        tasksStatus.droppedOff,
                        tasksStatus.cancelled,
                        tasksStatus.rejected,
                    ].includes(task.status)
                ) {
                    if (user) {
                        setActiveRiders((prevState) => ({
                            ...prevState,
                            [user.id]: user,
                        }));
                    }
                }
            }
        });
    }

    useEffect(() => {
        getActiveRiders();
    }, [dataStoreReadyStatus]);

    async function updateRiderHome(userId) {
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
    }

    return (
        <React.Fragment>
            <RiderConfirmationHomeContents
                onChangeTimeHome={(time) => (timeSet.current = time)}
                userId={updatingRider}
                onClose={() => setUpdatingRider(null)}
                onSelect={() => {
                    if (timeSet.current) {
                        console.log("updating rider home", updatingRider);
                        updateRiderHome(updatingRider);
                    }
                }}
            />
            <ScrollMenu
                alignItems="center"
                LeftArrow={
                    !activeRiders || _.isEmpty(activeRiders) ? null : LeftArrow
                }
                RightArrow={
                    !activeRiders || _.isEmpty(activeRiders) ? null : RightArrow
                }
            >
                {Object.values(activeRiders).map((rider) => {
                    return (
                        <Box
                            itemId={rider.id}
                            sx={{ margin: 0.5 }}
                            key={rider.id}
                        >
                            <UserChip
                                onClick={() => {
                                    setUpdatingRider(rider.id);
                                    timeSet.current = new Date();
                                }}
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
