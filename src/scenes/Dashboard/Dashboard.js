import React, { useEffect, useRef, useState } from "react";
import "../../App.css";
import { useHistory } from "react-router";
import * as models from "../../models/index";
import Paper from "@mui/material/Paper";
import { setRoleView } from "../../redux/Actions";
import TasksGrid from "./components/TasksGrid";
import { useDispatch, useSelector } from "react-redux";
import {
    DashboardDetailTabs,
    TabPanel,
} from "./components/DashboardDetailTabs";
import {
    convertListDataToObject,
    decodeUUID,
    getDashboardRoleMode,
    saveDashboardRoleMode,
} from "../../utilities";
import { dataStoreReadyStatusSelector, getWhoami } from "../../redux/Selectors";
import { tasksStatus, userRoles } from "../../apiConsts";
import { DataStore } from "aws-amplify";
import TasksGridSkeleton from "./components/TasksGridSkeleton";
import _ from "lodash";
import TaskDialogCompact from "../Task/TaskDialogCompact";
import { filterTasks } from "./utilities/functions";

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

function Dashboard(props) {
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);
    const [postPermission, setPostPermission] = useState(true);
    const dashboardFilter = useSelector((state) => state.dashboardFilter);
    const [filteredTasksIds, setFilteredTasksIds] = useState(null);
    const [viewMode, setViewMode] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const roleView = useSelector((state) => state.roleView);
    const [tasks, setTasks] = useState(initialTasksState);
    const tasksSubscription = useRef({
        unsubscribe: () => {},
    });

    function doSearch() {
        const result = filterTasks(tasks, dashboardFilter);
        setFilteredTasksIds(result);
    }

    useEffect(doSearch, [dashboardFilter, tasks]);

    async function filterTasksByRole() {
        if (roleView === "all") {
            setFilteredTasksIds(null);
            return;
        }
        const assignments = (
            await DataStore.query(models.TaskAssignee, (a) =>
                a.role("eq", roleView.toUpperCase())
            )
        ).filter((a) => a.assignee.id === whoami.id);
        const allTasks = await DataStore.query(models.Task);
        const ids = assignments.map((a) => a.task.id);
        const allIds = allTasks.map((t) => t.id);
        const include = [];
        for (const i of allIds) {
            if (ids.includes(i)) include.push(i);
        }

        setFilteredTasksIds(include);
    }
    useEffect(() => filterTasksByRole(), [roleView, tasks]);

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

    useEffect(() => {
        return () => {
            if (tasksSubscription.current)
                tasksSubscription.current.unsubscribe();
        };
    }, []);

    if (isFetching) {
        return <TasksGridSkeleton />;
    } else {
        return (
            <>
                <Paper>
                    <DashboardDetailTabs
                        value={viewMode}
                        onChange={(event, newValue) => setViewMode(newValue)}
                    >
                        <TabPanel value={0} index={0}>
                            <TasksGrid
                                showTaskIds={filteredTasksIds}
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
            </>
        );
    }
}

export default Dashboard;
