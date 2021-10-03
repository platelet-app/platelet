import React, { useEffect, useRef, useState } from "react";
import "../../App.css";
import "typeface-roboto";
import * as models from "../../models/index";
import Paper from "@material-ui/core/Paper";
import {
    setRoleViewAndGetTasks,
    startRefreshTasksLoopFromSocket,
} from "../../redux/tasks/TasksActions";
import { setNewTaskAddedView, setRoleView } from "../../redux/Actions";
import TasksGrid from "./components/TasksGrid";
import { useDispatch, useSelector } from "react-redux";
import {
    createLoadingSelector,
    createPostingSelector,
} from "../../redux/LoadingSelectors";
import {
    DashboardDetailTabs,
    TabPanel,
} from "./components/DashboardDetailTabs";
import {
    refreshTaskAssignmentsSocket,
    refreshTasksDataSocket,
    subscribeToCoordinatorAssignments,
    subscribeToRiderAssignments,
    subscribeToUUIDs,
    unsubscribeFromCoordinatorAssignments,
    unsubscribeFromRiderAssignments,
    unsubscribeFromUUIDs,
} from "../../redux/sockets/SocketActions";
import { getTaskUUIDEtags } from "./utilities";
import {
    convertListDataToObject,
    getDashboardRoleMode,
    saveDashboardRoleMode,
} from "../../utilities";
import {
    getTasksInitialisedStatus,
    getTasksSelector,
    getWhoami,
} from "../../redux/Selectors";
import { tasksStatus } from "../../apiConsts";
import { DataStore } from "aws-amplify";

const initialTasksState = {
    tasksNew: [],
    tasksActive: [],
    tasksPickedUp: [],
    tasksDroppedOff: [],
    tasksRejected: [],
    tasksCancelled: [],
};

function Dashboard() {
    const dispatch = useDispatch();
    const tasksInitialised = useSelector(getTasksInitialisedStatus);
    const mobileView = useSelector((state) => state.mobileView);
    const firstTaskSubscribeCompleted = useRef(false);
    const currentlySubscribedUUIDs = useRef([]);
    const whoami = useSelector(getWhoami);
    const [postPermission, setPostPermission] = useState(true);
    const [viewMode, setViewMode] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const roleView = useSelector((state) => state.roleView);
    const [tasks, setTasks] = useState(initialTasksState);

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

    function getTasks() {
        DataStore.query(models.Task, (task) => {
            task.status("eq", tasksStatus.new);
        }).then((result) => {
            const resultObject = convertListDataToObject(result);
            setTasks((prevState) => ({ ...prevState, tasksNew: resultObject }));
        });
    }
    useEffect(() => getTasks(), [roleView]);

    async function addTask() {
        const date = new Date();
        const timeOfCall = date.toISOString();
        const createdAt = timeOfCall;
        const newTask = await DataStore.save(
            new models.Task({ status: tasksStatus.new, timeOfCall })
        );
        setTasks((prevState) => ({
            ...prevState,
            tasksNew: {
                ...prevState.tasksNew,
                [newTask.id]: { ...newTask, timeOfCall, createdAt },
            },
        }));
    }

    return (
        <Paper elevation={3}>
            <DashboardDetailTabs
                value={viewMode}
                onChange={(event, newValue) => setViewMode(newValue)}
            >
                <TabPanel value={0} index={0}>
                    <TasksGrid
                        tasks={tasks}
                        onAddTaskClick={addTask}
                        fullScreenModal={mobileView}
                        modalView={"edit"}
                        hideRelayIcons={roleView === "rider"}
                        hideAddButton={!postPermission}
                        excludeColumnList={
                            viewMode === 1
                                ? ["tasksNew", "tasksActive", "tasksPickedUp"]
                                : [
                                      roleView === "rider" ? "tasksNew" : "",
                                      "tasksDelivered",
                                      "tasksCancelled",
                                      "tasksRejected",
                                  ]
                        }
                    />
                </TabPanel>
            </DashboardDetailTabs>
        </Paper>
    );
}

export default Dashboard;
