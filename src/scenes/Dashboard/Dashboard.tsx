import React, { useEffect } from "react";
import * as models from "../../models";
import "../../App.css";
import Paper from "@mui/material/Paper";
import {
    setDashboardFilteredUser,
    setGuidedSetupOpen,
    setRoleView,
} from "../../redux/Actions";
import TasksGrid from "./components/TasksGrid";
import { useDispatch, useSelector } from "react-redux";
import DashboardDetailTabs from "./components/DashboardDetailTabs";
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
    const roleView = useSelector(getRoleView);
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);

    const setInitialRoleView = React.useCallback(() => {
        if (whoami.id) {
            const savedRoleMode = getDashboardRoleMode();
            if (
                whoami.roles.includes(savedRoleMode) ||
                (savedRoleMode === "ALL" &&
                    whoami.roles.includes(models.Role.COORDINATOR))
            ) {
                dispatch(setRoleView(savedRoleMode));
            } else if (whoami.roles.includes(models.Role.COORDINATOR)) {
                dispatch(setRoleView(models.Role.COORDINATOR));
                saveDashboardRoleMode(models.Role.COORDINATOR);
            } else if (whoami.roles.includes(models.Role.RIDER)) {
                dispatch(setRoleView(models.Role.RIDER));
                dispatch(setDashboardFilteredUser(null));
                saveDashboardRoleMode(models.Role.RIDER);
            }
        }
    }, [dispatch, whoami.id, whoami.roles]);
    useEffect(setInitialRoleView, [whoami, setInitialRoleView]);

    return (
        <Stack>
            <Hidden mdUp>
                <DashboardDetailTabs />
            </Hidden>
            <Hidden mdDown>
                <Divider />
            </Hidden>
            <MultipleSelectionActionsMenu />
            <Hidden mdDown>
                <Divider />
            </Hidden>
            {[models.Role.COORDINATOR, "ALL"].includes(roleView) && (
                <>
                    <ActiveRidersChips />
                    <Divider />
                </>
            )}
            <Paper sx={{ marginBottom: 10 }}>
                <TasksGrid
                    modalView={"edit"}
                    hideRelayIcons={roleView === models.Role.RIDER}
                    excludeColumnList={
                        dashboardTabIndex === 1
                            ? [
                                  models.TaskStatus.NEW,
                                  models.TaskStatus.ACTIVE,
                                  models.TaskStatus.PICKED_UP,
                                  models.TaskStatus.DROPPED_OFF,
                              ]
                            : [
                                  roleView === models.Role.RIDER
                                      ? models.TaskStatus.NEW
                                      : "",
                                  models.TaskStatus.COMPLETED,
                                  models.TaskStatus.CANCELLED,
                                  models.TaskStatus.ABANDONED,
                                  models.TaskStatus.REJECTED,
                              ]
                    }
                />
            </Paper>
            <Hidden smUp>
                {roleView && roleView === models.Role.RIDER ? (
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
