import React, {useEffect, useRef} from 'react';
import '../../App.css';
import 'typeface-roboto'
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {getAllMyTasks, refreshAllMyTasks, refreshAllTasks} from '../../redux/tasks/TasksActions'
import {useDispatch, useSelector} from "react-redux"
import TasksGrid from "./components/TasksGrid";
import {
    useLocation,
} from "react-router-dom";
import {createLoadingSelector, createPostingSelector} from "../../redux/selectors";
import TasksGridSkeleton from "./components/TasksGridSkeleton"
import {getWhoami, refreshWhoami, setMenuIndex} from "../../redux/Actions";

function UsersTasks() {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(['GET_MY_TASKS']);
    const isFetching = useSelector(state => loadingSelector(state));
    const theme = useTheme();
    const fullScreenModal = !useMediaQuery(theme.breakpoints.up('md'));
    const tasks = useSelector(state => state.tasks.tasks);
    const myTasksEtag = useSelector(state => state.whoami.user.tasks_etag);
    const firstUpdate = useRef(true);
    const isTaskPostingSelector = createPostingSelector([
        "ADD_TASK",
        "GET_TASK",
        "DELETE_TASK",
        "RESTORE_TASK",
        "UPDATE_TASK",
        "UPDATE_TASK_CONTACT_NAME",
        "UPDATE_TASK_CONTACT_NUMBER",
        "UPDATE_TASK_PICKUP_ADDRESS",
        "UPDATE_TASK_DROPOFF_ADDRESS",
        "UPDATE_TASK_PICKUP_TIME",
        "UPDATE_TASK_DROPOFF_TIME",
        "UPDATE_TASK_CANCELLED_TIME",
        "UPDATE_TASK_REJECTED_TIME",
        "UPDATE_TASK_ASSIGNED_RIDER",
        "UPDATE_TASK_PRIORITY",
        "UPDATE_TASK_PATCH"
    ]);
    const isTaskPosting = useSelector(state => isTaskPostingSelector(state));

    function componentDidMount() {
        dispatch(getAllMyTasks());
    }
    useEffect(() => {dispatch(setMenuIndex(3))}, []);


    useEffect(componentDidMount, []);

    function setupRefreshTimer() {
        const timer = setInterval(() => {
            if (!process.env.REACT_APP_NO_SESSION_REFRESH)
                dispatch(refreshWhoami());
        }, 10000)
        return function cleanup() {
            clearInterval(timer);
        };
    }
    useEffect(setupRefreshTimer, []);

    let deferredRefresh = undefined;

    function refreshData() {
        // We don't need it to run the first time
        if (firstUpdate.current) {
            firstUpdate.current = false;
        } else {
            // Let's not update if there are changes being pushed
            if (isTaskPosting) {
                clearTimeout(deferredRefresh)
                // Defer it 5 seconds ahead
                deferredRefresh = setTimeout(() => dispatch(refreshAllMyTasks()), 5000)
            } else {
                clearTimeout(deferredRefresh)
                dispatch(refreshAllMyTasks());
            }
        }
    }

    useEffect(refreshData, [myTasksEtag])

    let location = useLocation();
    if (isFetching) {
        return <TasksGridSkeleton count={3}/>
    }
    else {
        return (
            <TasksGrid tasks={tasks}
                       location={location}
                       deleteDisabled={true}
                       fullScreenModal={fullScreenModal}
                       modalView={"simple"}
                       excludeColumnList={["tasksNew"]}
            />

        )
    }

}

export default UsersTasks;
