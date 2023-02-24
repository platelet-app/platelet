import React, { useRef, useState, useEffect } from "react";
import { TransitionGroup } from "react-transition-group";
import Fade from "@mui/material/Fade";
import { useDispatch, useSelector } from "react-redux";
import {
    dashboardFilteredUserSelector,
    dashboardTabIndexSelector,
    getRoleView,
    getWhoami,
    taskAssigneesSelector,
} from "../../../redux/Selectors";
import { userRoles } from "../../../apiConsts";
import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";
// disable horizontal scrollbar
import "./hideActiveRiderChipsScrollBar.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import _ from "lodash";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import UserChip from "../../../components/UserChip";
import { setDashboardFilteredUser } from "../../../redux/Actions";
import moment from "moment";
import * as models from "../../../models";
import { makeStyles } from "tss-react/mui";
import convertModelsToObject, {
    PersistentModelObjectType,
} from "../../../utilities/convertModelsToObject";

const useStyles = makeStyles()((theme: any) => ({
    gradientContainer: {
        position: "relative",
        height: 40,
        display: "flex",
        alignItems: "center",
    },
    gradientLeft: {
        background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, rgba(0,0,0,0) 100%)`,
        width: 35,
        height: "85%",
        position: "absolute",
        zIndex: 90,
    },
    gradientRight: {
        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${theme.palette.background.paper} 100%)`,
        width: 35,
        height: "85%",
        position: "absolute",
        right: 0,
        zIndex: 90,
    },
}));

function LeftArrow() {
    const theme = useTheme();
    const { classes } = useStyles();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const { isFirstItemVisible, isLastItemVisible, scrollPrev } =
        React.useContext(VisibilityContext);
    console.log("isFirstItemVisible", isFirstItemVisible);
    if (isFirstItemVisible && isLastItemVisible) {
        return null;
    } else if (isSm && isFirstItemVisible) {
        return null;
    } else if (isSm) {
        return (
            <TransitionGroup>
                <Fade in>
                    <Box className={classes.gradientContainer}>
                        <Box className={classes.gradientLeft} />
                    </Box>
                </Fade>
            </TransitionGroup>
        );
    } else {
        return (
            <Stack direction="row">
                <IconButton
                    disabled={isFirstItemVisible}
                    onClick={() => scrollPrev()}
                >
                    <ArrowBackIosIcon>Left</ArrowBackIosIcon>
                </IconButton>
                {!isFirstItemVisible && (
                    <Box className={classes.gradientContainer}>
                        <Box className={classes.gradientLeft} />
                    </Box>
                )}
            </Stack>
        );
    }
}

function RightArrow() {
    const theme = useTheme();
    const { classes } = useStyles();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const { isLastItemVisible, isFirstItemVisible, scrollNext } =
        React.useContext(VisibilityContext);
    if (isFirstItemVisible && isLastItemVisible) {
        return null;
    } else if (isSm && isLastItemVisible) {
        return null;
    } else if (isSm) {
        return (
            <TransitionGroup>
                <Fade in>
                    <Box className={classes.gradientContainer}>
                        <Box className={classes.gradientRight} />
                    </Box>
                </Fade>
            </TransitionGroup>
        );
    } else {
        return (
            <Stack direction="row-reverse">
                <IconButton
                    disabled={isLastItemVisible}
                    onClick={() => scrollNext()}
                >
                    <ArrowForwardIosIcon sx={{ height: "100%" }}>
                        Right
                    </ArrowForwardIosIcon>
                </IconButton>
                {!isLastItemVisible && (
                    <Box className={classes.gradientContainer}>
                        <Box className={classes.gradientRight} />
                    </Box>
                )}
            </Stack>
        );
    }
}

const completedTabFilter = (assignment: models.TaskAssignee) => {
    // if the job is in completed tab then only find out riders from the last week
    // to mimic the dashboard
    return (
        assignment.task &&
        [
            models.TaskStatus.REJECTED,
            models.TaskStatus.ABANDONED,
            models.TaskStatus.CANCELLED,
            models.TaskStatus.COMPLETED,
        ].some((ts) => assignment.task.status === ts) &&
        moment(assignment.task.createdAt).isAfter(moment().subtract(1, "week"))
    );
};

const inProgressTabFilter = (assignment: models.TaskAssignee) => {
    return (
        assignment.task &&
        [
            models.TaskStatus.NEW,
            models.TaskStatus.ACTIVE,
            models.TaskStatus.PICKED_UP,
            models.TaskStatus.DROPPED_OFF,
        ].some((ts) => assignment.task.status === ts)
    );
};

const ActiveRidersChips: React.FC = () => {
    const [activeRiders, setActiveRiders] = useState<
        PersistentModelObjectType<models.User>
    >({});
    const [errorState, setErrorState] = useState<any>(null);
    const whoami = useSelector(getWhoami);
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);
    const allAssignees: models.TaskAssignee[] = useSelector(
        taskAssigneesSelector
    ).items;
    const animate = useRef(false);
    const roleView = useSelector(getRoleView);
    const dashboardFilteredUserRef = useRef(null);
    dashboardFilteredUserRef.current = dashboardFilteredUser;
    const theme = useTheme();
    const dispatch = useDispatch();

    const calculateRidersStatus =
        React.useCallback((): PersistentModelObjectType<models.User> => {
            let activeRidersResult: models.User[] = [];
            if (roleView === "ALL") {
                const assignments: models.TaskAssignee[] = allAssignees.filter(
                    (a) => a.role === userRoles.rider
                );
                activeRidersResult = assignments
                    .filter(
                        dashboardTabIndex === 0
                            ? inProgressTabFilter
                            : completedTabFilter
                    )
                    .map((a) => a.assignee);
            } else if (roleView === userRoles.coordinator && whoami) {
                const myAssignments = allAssignees.filter(
                    (a) =>
                        a.role === userRoles.coordinator &&
                        a.assignee &&
                        a.assignee.id === whoami.id
                );
                const myAssignedTasksIds = myAssignments.map(
                    (a) => a.task && a.task.id
                );
                // find which tasks assigned to me are assigned to the rider
                const assignedToMeRiders = allAssignees.filter(
                    (a) =>
                        a.role === userRoles.rider &&
                        a.assignee &&
                        a.task &&
                        myAssignedTasksIds.includes(a.task.id)
                );
                activeRidersResult = assignedToMeRiders
                    .filter(
                        dashboardTabIndex === 0
                            ? inProgressTabFilter
                            : completedTabFilter
                    )
                    .map((a) => a.assignee);
            }

            if (
                dashboardFilteredUserRef.current &&
                !activeRidersResult
                    .map((u: models.User) => u.id)
                    .includes(dashboardFilteredUserRef.current)
            ) {
                dispatch(setDashboardFilteredUser(null));
            }

            // resort alphabetically for now
            // I have no idea why the completed tab sort function reverses the order
            const sorted = activeRidersResult.sort((a, b) =>
                a.displayName.localeCompare(b.displayName)
            );

            return convertModelsToObject(sorted);
        }, [allAssignees, dispatch, roleView, dashboardTabIndex, whoami]);

    const getActiveRiders = React.useCallback(async () => {
        try {
            setActiveRiders(calculateRidersStatus());
            animate.current = true;
        } catch (error) {
            console.log(error);
            setErrorState(error);
        }
    }, [calculateRidersStatus]);

    useEffect(() => {
        getActiveRiders();
    }, [roleView, allAssignees, dashboardTabIndex, getActiveRiders]);

    const riderChipElements = Object.values(activeRiders).map((rider) => {
        return (
            <Box sx={{ margin: 0.5 }} key={rider.id}>
                <UserChip
                    showResponsibility
                    onClick={() => {
                        if (dashboardFilteredUser === rider.id) {
                            dispatch(setDashboardFilteredUser(null));
                        } else {
                            dispatch(setDashboardFilteredUser(rider.id));
                        }
                    }}
                    color={
                        dashboardFilteredUser === rider.id
                            ? "primary"
                            : undefined
                    }
                    variant={
                        dashboardFilteredUser === rider.id
                            ? undefined
                            : "outlined"
                    }
                    user={rider}
                />
            </Box>
        );
    });

    const allChipElements = [
        <Box key="active-rider-chips-all" sx={{ margin: 0.5 }}>
            <Chip
                label="All"
                onClick={() => dispatch(setDashboardFilteredUser(null))}
                variant={dashboardFilteredUser === null ? "filled" : "outlined"}
            />
        </Box>,
        ...riderChipElements,
    ];

    if (errorState) {
        return <Typography>Sorry, something went wrong.</Typography>;
    }
    return (
        <Box sx={{ background: theme.palette.background.paper }}>
            <ScrollMenu
                LeftArrow={
                    !activeRiders || _.isEmpty(activeRiders) ? null : LeftArrow
                }
                RightArrow={
                    !activeRiders || _.isEmpty(activeRiders) ? null : RightArrow
                }
            >
                {allChipElements}
            </ScrollMenu>
        </Box>
    );
};
export default ActiveRidersChips;
