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
    subscribeToAssignments,
    subscribeToUUIDs,
} from "../../redux/sockets/SocketActions";
import {getTaskUUIDs} from "./utilities";
import {initialTasksState} from "../../redux/tasks/TasksReducers";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    dashboard: {
        width: "1280px"
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
    const whoami = useSelector(state => state.whoami.user);
    const [postPermission, setPostPermission] = useState(true);
    const [viewMode, setViewMode] = useState(0);

    function componentDidMount() {
        dispatch(clearCurrentTask());
    }

    useEffect(componentDidMount, []);

    function getTasks() {
        if (whoami.uuid) {
            if (tasks === initialTasksState.tasks)
                dispatch(getAllTasksRequest(whoami.uuid, "", "coordinator"));
        }
    }

    useEffect(getTasks, [whoami])


    function subscribeTasks() {
        const taskUUIDs = getTaskUUIDs(tasks);
        if (taskUUIDs.length !== 0 && !firstTaskSubscribeCompleted.current) {
            firstTaskSubscribeCompleted.current = true;
            dispatch(subscribeToUUIDs(taskUUIDs))
        }
    }

    useEffect(subscribeTasks, [tasks]);

    function subscribeAssignmentsToMe() {
        if (whoami.uuid)
            dispatch(subscribeToAssignments(whoami.uuid))
    }

    useEffect(subscribeAssignmentsToMe, [whoami]);

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
                <DashboardDetailTabs value={viewMode} onChange={(event, newValue) => setViewMode(newValue)}>
                    <TabPanel value={0} index={0}>
                        <TasksGrid tasks={tasks}
                                   fullScreenModal={mobileView}
                                   modalView={"edit"}
                                   hideAddButton={!postPermission}
                                   excludeColumnList={viewMode === 1 ? ["tasksNew", "tasksActive", "tasksPickedUp"] : ["tasksDelivered", "tasksCancelled", "tasksRejected"]}
                        />
                    </TabPanel>
                </DashboardDetailTabs>
            </Paper>
        )
    }
}

export default Dashboard;
