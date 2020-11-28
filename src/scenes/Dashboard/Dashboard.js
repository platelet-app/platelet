import React, {useEffect, useRef, useState} from 'react';
import '../../App.css';
import 'typeface-roboto'
import Paper from "@material-ui/core/Paper";
import {
    clearCurrentTask,
    getAllTasksRequest,
} from '../../redux/tasks/TasksActions'
import {
    setNewTaskAddedView,
} from "../../redux/Actions";
import TasksGrid from "./components/TasksGrid";
import {useDispatch, useSelector} from "react-redux"
import {createLoadingSelector, createPostingSelector} from "../../redux/selectors";
import TasksGridSkeleton from "./components/TasksGridSkeleton";
import StatsSkeleton from "./components/StatsSkeleton";
import {DashboardDetailTabs, TabPanel} from "./components/DashboardDetailTabs";
import {
    refreshTaskAssignmentsSocket,
    refreshTasksDataSocket,
    subscribeToCoordinatorAssignments,
    subscribeToRiderAssignments,
    subscribeToUUIDs,
    unsubscribeFromCoordinatorAssignments,
    unsubscribeFromRiderAssignments,
    unsubscribeFromUUID,
    unsubscribeFromUUIDs,
} from "../../redux/sockets/SocketActions";
import {getTaskUUIDEtags, getTaskUUIDs} from "./utilities";
import {initialTasksState} from "../../redux/tasks/TasksReducers";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    dashboard: {
        width: "1410px"
    }
})

function Dashboard(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
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
    const [roleView, setRoleView] = useState("coordinator");

    function componentDidMount() {
        dispatch(clearCurrentTask());
    }
    useEffect(componentDidMount, []);

    function setInitialRoleView() {
        if (whoami.uuid) {
            if (whoami.roles.includes("coordinator"))
                setRoleView("coordinator")
            else
                setRoleView("rider")
        }
    }
    useEffect(setInitialRoleView, [whoami])

    function getTasks() {
        if (whoami.uuid) {
            dispatch(getAllTasksRequest(whoami.uuid, "", roleView));
        }
    }
    useEffect(getTasks, [whoami, roleView])

    function refreshTasks() {
        if (!isFetching && tasks) {
            console.log("refreshing tasks")
            const uuidEtags = getTaskUUIDEtags(tasks);
            const uuids = Object.keys(uuidEtags);
            //dispatch(refreshTaskAssignmentsSocket(whoami.uuid, uuids, "coordinator"))
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
            // Check tasks hash every 30 seconds
            const refreshTimer = setInterval(() => {
                console.log("refreshing tasks")
                const uuidEtags = getTaskUUIDEtags(tasks);
                const uuids = Object.keys(uuidEtags);
               // dispatch(refreshTaskAssignmentsSocket(whoami.uuid, uuids, "coordinator"))
                dispatch(refreshTasksDataSocket(uuidEtags));
            }, 30000);

            // cancel refresh on unmount
            return () => clearInterval(refreshTimer);
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

    if (isFetching || viewMode === null) {
        return viewMode === "stats" || props.statsView ? <StatsSkeleton/> : <TasksGridSkeleton count={4}/>
        // TODO: do the redirect to task thing here
        //} else if (newTaskAddedView()) {
        //    return <Redirect to={`/task/${encodeUUID("")}`}/>
    } else {
        return (
            <Paper className={classes.dashboard} elevation={3}>
                <DashboardDetailTabs value={viewMode} roleView={roleView} onSetRoleMode={value => setRoleView(value)} onChange={(event, newValue) => setViewMode(newValue)}>
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
}

export default Dashboard;
