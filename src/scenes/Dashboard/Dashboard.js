import React, {useEffect, useRef, useState} from 'react';
import '../../App.css';
import 'typeface-roboto'
import Paper from "@material-ui/core/Paper";
import {
    clearCurrentTask,
    setRoleViewAndGetTasks,
    startRefreshTasksLoopFromSocket,
} from '../../redux/tasks/TasksActions'
import {
    setNewTaskAddedView,
} from "../../redux/Actions";
import TasksGrid from "./components/TasksGrid";
import {useDispatch, useSelector} from "react-redux"
import {createLoadingSelector, createPostingSelector} from "../../redux/selectors";
import {DashboardDetailTabs, TabPanel} from "./components/DashboardDetailTabs";
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
import {getTaskUUIDEtags} from "./utilities";
import {initialTasksState} from "../../redux/tasks/TasksReducers";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {getDashboardRoleMode, saveDashboardRoleMode} from "../../utilities";

const useStyles = makeStyles({
    dashboard: {
        width: "1280px"
    }
})

function Dashboard() {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(['GET_TASKS']);
    const isFetching = useSelector(state => loadingSelector(state));
    const isPostingNewTaskSelector = createPostingSelector(["ADD_TASK"]);
    const isPostingNewTask = useSelector(state => isPostingNewTaskSelector(state));
    const tasks = useSelector(state => state.tasks.tasks);
    const mobileView = useSelector(state => state.mobileView);
    const firstUpdateNewTask = useRef(true);
    const firstTaskSubscribeCompleted = useRef(false);
    const currentlySubscribedUUIDs = useRef([]);
    const whoami = useSelector(state => state.whoami.user);
    const [postPermission, setPostPermission] = useState(true);
    const [viewMode, setViewMode] = useState(0);
    const roleView = useSelector(state => state.roleView);


    function componentDidMount() {
        dispatch(clearCurrentTask());
    }
    useEffect(componentDidMount, []);

    function setInitialRoleView() {
        if (whoami.uuid && tasks === initialTasksState.tasks) {
            const savedRoleMode = getDashboardRoleMode();
            if (whoami.roles.includes(savedRoleMode))
                dispatch(setRoleViewAndGetTasks(whoami.uuid, "", savedRoleMode));
            else if (whoami.roles.includes("coordinator")) {
                dispatch(setRoleViewAndGetTasks(whoami.uuid, "", "coordinator"));
                saveDashboardRoleMode("coordinator");
            }
        else if (whoami.roles.includes("rider")) {
                dispatch(setRoleViewAndGetTasks(whoami.uuid, "", "rider"));
                saveDashboardRoleMode("rider");
            }

        }
    }
    useEffect(setInitialRoleView, [whoami])


    function refreshTasks() {
        return
        if (!isFetching && tasks) {
            console.log("refreshing tasks")
            const uuidEtags = getTaskUUIDEtags(tasks);
            const uuids = Object.keys(uuidEtags);
            dispatch(refreshTaskAssignmentsSocket(whoami.uuid, uuids, roleView))
            dispatch(refreshTasksDataSocket(uuidEtags));
            if (firstTaskSubscribeCompleted.current) {
                dispatch(unsubscribeFromUUIDs(currentlySubscribedUUIDs.current))
            }
            dispatch(subscribeToUUIDs(uuids))
            currentlySubscribedUUIDs.current = uuids;
            firstTaskSubscribeCompleted.current = true;
            if (roleView === "rider") {
                dispatch(unsubscribeFromCoordinatorAssignments(whoami.uuid))
                dispatch(subscribeToRiderAssignments(whoami.uuid))
            } else {
                dispatch(unsubscribeFromRiderAssignments(whoami.uuid))
                dispatch(subscribeToCoordinatorAssignments(whoami.uuid))
            }
            dispatch(startRefreshTasksLoopFromSocket(whoami.uuid))

        }
    }
    useEffect(refreshTasks, [isFetching])


    function onAddNewTask() {
        return
        // We don't want it to run the first time
        if (firstUpdateNewTask.current)
            firstUpdateNewTask.current = false;
        else if (!isPostingNewTask)
            dispatch(setNewTaskAddedView(true))
    }

    useEffect(onAddNewTask, [isPostingNewTask])

        // TODO: do the redirect to task thing here
        //} else if (newTaskAddedView()) {
        //    return <Redirect to={`/task/${encodeUUID("")}`}/>
        return (
            <Paper elevation={3}>
                <DashboardDetailTabs value={viewMode} onChange={(event, newValue) => setViewMode(newValue)}>
                    <TabPanel value={0} index={0}>
                        <TasksGrid tasks={tasks}
                                   fullScreenModal={mobileView}
                                   modalView={"edit"}
                                   hideRelayIcons={(roleView === "rider")}
                                   hideAddButton={!postPermission}
                                   excludeColumnList={viewMode === 1 ? ["tasksNew", "tasksActive", "tasksPickedUp"] : [roleView === "rider" ? "tasksNew" : "", "tasksDelivered", "tasksCancelled", "tasksRejected"]}
                        />
                    </TabPanel>
                </DashboardDetailTabs>
            </Paper>
        )
}

export default Dashboard;
