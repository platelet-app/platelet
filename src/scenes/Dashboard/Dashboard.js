import React, { useEffect, useState } from "react";
import "../../App.css";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import { setRoleView } from "../../redux/Actions";
import TasksGrid from "./components/TasksGrid";
import { useDispatch, useSelector } from "react-redux";
import {
    DashboardDetailTabs,
    TabPanel,
} from "./components/DashboardDetailTabs";
import {
    encodeUUID,
    getDashboardRoleMode,
    saveDashboardRoleMode,
} from "../../utilities";
import { dataStoreReadyStatusSelector, getWhoami } from "../../redux/Selectors";
import { tasksStatus, userRoles } from "../../apiConsts";
import { clearDashboardFilter } from "../../redux/dashboardFilter/DashboardFilterActions";
import { Fab, Hidden } from "@mui/material";
import { addTask } from "./utilities";
import { useHistory } from "react-router";

function AddClearFab() {
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);
    const dashboardFilter = useSelector((state) => state.dashboardFilter);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const history = useHistory();
    const addClearFab = !dashboardFilter ? (
        <Fab
            sx={{ position: "fixed", zIndex: 100, bottom: 30, right: 30 }}
            variant="contained"
            disabled={!dataStoreReadyStatus}
            color="primary"
            onClick={async () => {
                const newTask = await addTask(whoami ? whoami.id : null);
                history.push(`/task/${encodeUUID(newTask.id)}`);
            }}
        >
            <AddIcon />
        </Fab>
    ) : (
        <Fab
            sx={{ position: "fixed", zIndex: 100, bottom: 30, right: 30 }}
            color="primary"
            variant="extended"
            onClick={() => dispatch(clearDashboardFilter())}
        >
            Clear Search
        </Fab>
    );
    return addClearFab;
}

function Dashboard() {
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);
    const [postPermission, setPostPermission] = useState(true);
    const [viewMode, setViewMode] = useState(0);
    const roleView = useSelector((state) => state.roleView);

    function setInitialRoleView() {
        if (whoami.id) {
            const savedRoleMode = getDashboardRoleMode();
            if (
                whoami.roles.includes(savedRoleMode) ||
                (savedRoleMode === "all" &&
                    whoami.roles.includes("COORDINATOR"))
            ) {
                dispatch(setRoleView(savedRoleMode));
            } else if (whoami.roles.includes("COORDINATOR")) {
                dispatch(setRoleView("coordinator"));
                saveDashboardRoleMode("coordinator");
            } else if (whoami.roles.includes("RIDER")) {
                dispatch(setRoleView("rider"));
                saveDashboardRoleMode("rider");
            }
        }
    }
    useEffect(setInitialRoleView, [whoami]);

    return (
        <>
            <Paper>
                <DashboardDetailTabs
                    value={viewMode}
                    onChange={(event, newValue) => setViewMode(newValue)}
                >
                    <TabPanel value={0} index={0}>
                        <TasksGrid
                            modalView={"edit"}
                            hideRelayIcons={roleView === "rider"}
                            hideAddButton={!postPermission}
                            excludeColumnList={
                                viewMode === 1
                                    ? [
                                          tasksStatus.new,
                                          tasksStatus.active,
                                          tasksStatus.pickedUp,
                                      ]
                                    : [
                                          roleView === "rider"
                                              ? tasksStatus.new
                                              : "",
                                          tasksStatus.droppedOff,
                                          tasksStatus.cancelled,
                                          tasksStatus.rejected,
                                      ]
                            }
                        />
                    </TabPanel>
                </DashboardDetailTabs>
            </Paper>
            <Hidden smUp>
                {roleView && roleView === userRoles.rider.toLowerCase() ? (
                    <></>
                ) : (
                    <AddClearFab />
                )}
            </Hidden>
        </>
    );
}

export default Dashboard;
