import React, {useEffect, useRef} from 'react';
import '../../App.css';
import 'typeface-roboto'
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {getAllMyTasks, refreshAllMyTasks, refreshAllTasks, updateTaskFromSocket} from '../../redux/tasks/TasksActions'
import {useDispatch, useSelector} from "react-redux"
import TasksGrid from "./components/TasksGrid";
import {
    useLocation,
} from "react-router-dom";
import {createLoadingSelector, createPostingSelector} from "../../redux/selectors";
import TasksGridSkeleton from "./components/TasksGridSkeleton"
import {getWhoami, refreshWhoami, setMenuIndex} from "../../redux/Actions";
import {subscribeToUUID, unsubscribeFromUUID} from "../../redux/sockets/SocketActions";
import {concatTasks} from "./utilities";
import {getTabIdentifier} from "../../utilities";

function UsersTasks() {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(['GET_MY_TASKS']);
    const isFetching = useSelector(state => loadingSelector(state));
    const theme = useTheme();
    const fullScreenModal = !useMediaQuery(theme.breakpoints.up('md'));
    const tasks = useSelector(state => state.tasks.tasks);
    const socketSubscription = useSelector(state => state.subscription);

    function componentDidMount() {
        dispatch(getAllMyTasks());
        return function cleanup() {
            const joinedTasks = concatTasks(tasks);
            joinedTasks.forEach((task) => {
                dispatch(unsubscribeFromUUID(task.uuid))
            })
        }
    }
    useEffect(componentDidMount, []);

    useEffect(() => {dispatch(setMenuIndex(3))}, []);
    useEffect(() => {
        if (Object.keys(socketSubscription).length === 0 && socketSubscription.constructor === Object) {
            console.log("ignore")
        } else {
            if (socketSubscription.tab_id != null && getTabIdentifier() !== socketSubscription.tab_id) {
                dispatch(updateTaskFromSocket({taskUUID: socketSubscription.object_uuid, payload: socketSubscription.data}))
                console.log(socketSubscription.data)
            } else
                console.log("this came from us")
        }

    }, [socketSubscription])

    function subscribeTasks() {
        const joinedTasks = concatTasks(tasks);
        joinedTasks.forEach((task) => {
            dispatch(subscribeToUUID(task.uuid))
        })
    }
    useEffect(subscribeTasks, [tasks])


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
