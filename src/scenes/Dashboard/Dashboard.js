import React, { useEffect, useState } from "react";
import "../../App.css";
import Paper from "@mui/material/Paper";
import {
    setDashboardFilteredUser,
    setGuidedSetupOpen,
    setRoleView,
} from "../../redux/Actions";
import TasksGrid from "./components/TasksGrid";
import { useDispatch, useSelector } from "react-redux";
import { DashboardDetailTabs } from "./components/DashboardDetailTabs";
import { getDashboardRoleMode, saveDashboardRoleMode } from "../../utilities";
import {
    dashboardFilteredUserSelector,
    dashboardFilterTermSelector,
    dashboardTabIndexSelector,
    getRoleView,
    getWhoami,
    guidedSetupOpenSelector,
    selectedItemsSelector,
} from "../../redux/Selectors";
import { tasksStatus, userRoles } from "../../apiConsts";
import { clearDashboardFilter } from "../../redux/dashboardFilter/DashboardFilterActions";
import { Divider, Fab, Hidden, Stack } from "@mui/material";
import ActiveRidersChips from "./components/ActiveRidersChips";
import GuidedSetupDrawer from "./components/GuidedSetupDrawer";
import MultipleSelectionActionsMenu from "./components/MultipleSelectionActionsMenu";
import _ from "lodash";

function AddClearFab() {
    const dispatch = useDispatch();
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const dashboardFilter = useSelector(dashboardFilterTermSelector);
    const guidedSetupOpen = useSelector(guidedSetupOpenSelector);
    const selectedItems = useSelector(selectedItemsSelector);
    const tabIndex = useSelector(dashboardTabIndexSelector);
    const items = selectedItems[tabIndex];
    const filterOn = !!dashboardFilter || !!dashboardFilteredUser;
    const message = filterOn ? "Clear search" : "Create new";

    function handleClick() {
        if (filterOn) {
            dispatch(clearDashboardFilter());
            dispatch(setDashboardFilteredUser(null));
        } else {
            dispatch(setGuidedSetupOpen(true));
        }
    }

    return (
        <Fab
            sx={{
                display: {
                    xs: _.isEmpty(items) ? "block" : "none",
                    sm: "block",
                },
                position: "fixed",
                zIndex: 100,
                bottom: 30,
                right: 30,
            }}
            color={filterOn ? "secondary" : "primary"}
            variant="extended"
            disabled={guidedSetupOpen}
            onClick={handleClick}
        >
            {message}
        </Fab>
    );
}

function Dashboard() {
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);
    const [postPermission, setPostPermission] = useState(true);
    const roleView = useSelector(getRoleView);
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);

    function setInitialRoleView() {
        if (whoami.id) {
            const savedRoleMode = getDashboardRoleMode();
            if (
                whoami.roles.includes(savedRoleMode) ||
                (savedRoleMode === "ALL" &&
                    whoami.roles.includes(userRoles.coordinator))
            ) {
                dispatch(setRoleView(savedRoleMode));
            } else if (whoami.roles.includes(userRoles.coordinator)) {
                dispatch(setRoleView(userRoles.coordinator));
                saveDashboardRoleMode(userRoles.coordinator);
            } else if (whoami.roles.includes(userRoles.rider)) {
                dispatch(setRoleView(userRoles.rider));
                dispatch(setDashboardFilteredUser(null));
                saveDashboardRoleMode(userRoles.rider);
            }
        }
    }
    useEffect(setInitialRoleView, [whoami]);

    return (
        <Stack divider={<Divider />}>
            <Hidden mdUp>
                <DashboardDetailTabs />
            </Hidden>
            <MultipleSelectionActionsMenu />
            {[userRoles.coordinator, "ALL"].includes(roleView) && (
                <ActiveRidersChips />
            )}
            <Paper sx={{ marginBottom: 10 }}>
                <TasksGrid
                    modalView={"edit"}
                    hideRelayIcons={roleView === userRoles.rider}
                    hideAddButton={!postPermission}
                    excludeColumnList={
                        dashboardTabIndex === 1
                            ? [
                                  tasksStatus.new,
                                  tasksStatus.active,
                                  tasksStatus.pickedUp,
                                  tasksStatus.droppedOff,
                              ]
                            : [
                                  roleView === userRoles.rider
                                      ? tasksStatus.new
                                      : "",
                                  tasksStatus.completed,
                                  tasksStatus.cancelled,
                                  tasksStatus.abandoned,
                                  tasksStatus.rejected,
                              ]
                    }
                />
            </Paper>
            <Hidden smUp>
                {roleView && roleView === userRoles.rider ? (
                    <></>
                ) : (
                    <AddClearFab />
                )}
            </Hidden>
            <GuidedSetupDrawer />
        </Stack>
    );
}

export default Dashboard;
