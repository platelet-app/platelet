import React, { useEffect, useRef, useState } from "react";
import "../../App.css";
import AddIcon from "@mui/icons-material/Add";
import * as models from "../../models/index";
import Paper from "@mui/material/Paper";
import { setRoleView } from "../../redux/Actions";
import TasksGrid from "./components/TasksGrid";
import { useDispatch, useSelector } from "react-redux";
import {
    DashboardDetailTabs,
    TabPanel,
} from "./components/DashboardDetailTabs";
import { getDashboardRoleMode, saveDashboardRoleMode } from "../../utilities";
import { dataStoreReadyStatusSelector, getWhoami } from "../../redux/Selectors";
import { tasksStatus } from "../../apiConsts";
import { DataStore } from "aws-amplify";
import _ from "lodash";
import { clearDashboardFilter } from "../../redux/dashboardFilter/DashboardFilterActions";
import { Fab, Hidden } from "@mui/material";
import { addTask } from "./utilities";

const initialTasksState = {
    tasksNew: {},
    tasksActive: {},
    tasksPickedUp: {},
    tasksDroppedOff: {},
    tasksRejected: {},
    tasksCancelled: {},
};
function findTask(tasks, taskId) {
    if (!tasks || !taskId) return { task: undefined, key: undefined };
    for (const taskKey of Object.keys(initialTasksState)) {
        if (tasks[taskKey][taskId])
            return { task: tasks[taskKey][taskId], key: taskKey };
    }
    return { task: undefined, key: undefined };
}

function getKeyFromEnum(value) {
    switch (value) {
        case tasksStatus.new:
            return "tasksNew";
        case tasksStatus.active:
            return "tasksActive";
        case tasksStatus.pickedUp:
            return "tasksPickedUp";
        case tasksStatus.droppedOff:
            return "tasksDroppedOff";
        case tasksStatus.cancelled:
            return "tasksCancelled";
        case tasksStatus.rejected:
            return "tasksRejected";
        default:
            return "";
    }
}

function AddClearFab() {
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);
    const dashboardFilter = useSelector((state) => state.dashboardFilter);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const addClearFab = !dashboardFilter ? (
        <Fab
            sx={{ position: "fixed", zIndex: 2000, bottom: 30, right: 30 }}
            variant="contained"
            disabled={!dataStoreReadyStatus}
            color="primary"
            onClick={() => addTask(whoami ? whoami.id : null)}
        >
            <AddIcon />
        </Fab>
    ) : (
        <Fab
            variant="contained"
            sx={{ position: "fixed", zIndex: 2000, bottom: 30, right: 30 }}
            color="primary"
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
                <AddClearFab />
            </Hidden>
        </>
    );
}

export default Dashboard;
