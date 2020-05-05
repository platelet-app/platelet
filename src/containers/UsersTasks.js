import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import {Skeleton} from "@material-ui/lab";
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {getAllMyTasks} from '../redux/tasks/TasksActions'
import {connect, useDispatch, useSelector} from "react-redux"
import TasksGrid from "../components/TasksGrid";
import {
    useLocation,
} from "react-router-dom";
import {createLoadingSelector} from "../redux/selectors";
import TasksGridSkeleton from "../loadingComponents/TasksGridSkeleton"
import {setMenuIndex} from "../redux/Actions";

function UsersTasks() {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(['GET_MY_TASKS']);
    const isFetching = useSelector(state => loadingSelector(state));
    const theme = useTheme();
    const fullScreenModal = !useMediaQuery(theme.breakpoints.up('md'));

    function componentDidMount() {
        dispatch(getAllMyTasks());
    }
    useEffect(() => {dispatch(setMenuIndex(3))}, []);

    const tasks = useSelector(state => state.tasks.tasks);

    useEffect(componentDidMount, []);

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
