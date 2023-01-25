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
import { makeStyles } from "@mui/styles";
import convertModelsToObject, {
    PersistentModelObjectType,
} from "../../../utilities/convertModelsToObject";
import useRoleAssignments from "../../../hooks/useRoleAssignments";
import { ResolvedTaskAssignee } from "../../../resolved-models";

const useStyles = makeStyles((theme: any) => ({
    gradientContainer: {
        position: "relative",
        height: 40,
        display: "flex",
        alignItems: "center",
    },
    gradientLeft: () => {
        const background = `linear-gradient(90deg, ${theme.palette.background.paper} 0%, rgba(0,0,0,0) 100%)`;
        return {
            background: background,
            width: 35,
            height: "85%",
            position: "absolute",
            zIndex: 90,
        };
    },
    gradientRight: () => {
        const background = `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${theme.palette.background.paper} 100%)`;
        return {
            background: background,
            width: 35,
            height: "85%",
            position: "absolute",
            right: 0,
            zIndex: 90,
        };
    },
}));

function LeftArrow() {
    const theme = useTheme();
    const classes = useStyles();
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
    const classes = useStyles();
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

const completedTabFilter = async (assignment: models.TaskAssignee) => {
    // if the job is in completed tab then only find out riders from the last week
    // to mimic the dashboard
    const task = await assignment.task;
    return (
        task &&
        [
            models.TaskStatus.REJECTED,
            models.TaskStatus.ABANDONED,
            models.TaskStatus.CANCELLED,
            models.TaskStatus.COMPLETED,
        ].some((ts) => task.status === ts) &&
        moment(task.createdAt).isAfter(moment().subtract(1, "week"))
    );
};

const inProgressTabFilter = async (assignment: models.TaskAssignee) => {
    const task = await assignment.task;
    return (
        task &&
        [
            models.TaskStatus.NEW,
            models.TaskStatus.ACTIVE,
            models.TaskStatus.PICKED_UP,
            models.TaskStatus.DROPPED_OFF,
        ].some((ts) => task.status === ts)
    );
};

const getTaskStatuses = (tabIndex: number) => {
    switch (tabIndex) {
        case 0:
            return [
                models.TaskStatus.ACTIVE,
                models.TaskStatus.NEW,
                models.TaskStatus.PICKED_UP,
                models.TaskStatus.DROPPED_OFF,
            ];
        case 1:
            return [
                models.TaskStatus.REJECTED,
                models.TaskStatus.ABANDONED,
                models.TaskStatus.CANCELLED,
                models.TaskStatus.COMPLETED,
            ];
        default:
            return [];
    }
};

const alphabeticalSort = (a: models.User, b: models.User) => {
    return a.displayName.localeCompare(b.displayName);
};

const ActiveRidersChips: React.FC = () => {
    const [activeRiders, setActiveRiders] = useState<
        PersistentModelObjectType<models.User>
    >({});
    const whoami = useSelector(getWhoami);
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);
    const roleView = useSelector(getRoleView);
    const dashboardFilteredUserRef = useRef(null);
    dashboardFilteredUserRef.current = dashboardFilteredUser;
    const theme = useTheme();
    const dispatch = useDispatch();

    const taskStatues = getTaskStatuses(dashboardTabIndex);

    const coordinatorId =
        roleView === models.Role.COORDINATOR && whoami ? whoami.id : null;

    const oneWeekAgo = React.useRef(moment().subtract(1, "week").toDate());

    const { state, error } = useRoleAssignments(
        models.Role.RIDER,
        taskStatues,
        coordinatorId,
        dashboardTabIndex === 1 ? oneWeekAgo.current : null
    );

    React.useEffect(() => {
        const users = state.map((assignment) => assignment.assignee);
        setActiveRiders(convertModelsToObject(users));
    }, [state]);

    const riderChipElements = Object.values(activeRiders)
        .sort(alphabeticalSort)
        .map((rider) => {
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

    if (error) {
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
