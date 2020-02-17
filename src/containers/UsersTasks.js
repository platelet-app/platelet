import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import {Skeleton} from "@material-ui/lab";
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {getAllMyTasks} from '../redux/Actions'
import {connect, useDispatch, useSelector} from "react-redux"
import TasksGrid from "../components/TasksGrid";
import {
    useLocation,
} from "react-router-dom";
import {createLoadingSelector} from "../redux/selectors";
import TasksGridSkeleton, {TasksGridSkelenton} from "../loadingComponents/TasksGridSkeleton"

function UsersTasks(props) {
    console.log(props.isFetching)
    const dispatch = useDispatch();
    const theme = useTheme();
    const fullScreenModal = !useMediaQuery(theme.breakpoints.up('md'));

    function componentDidMount() {
        dispatch(getAllMyTasks());
    }

    const tasks = useSelector(state => state.tasks);

    useEffect(componentDidMount, []);

    let location = useLocation();
    if (props.isFetching) {
        return <TasksGridSkeleton count={3}/>
    }
    else {
        return (
            <TasksGrid tasks={tasks}
                       location={location}
                       fullScreenModal={fullScreenModal}
                       modalView={"simple"}
                       excludeColumnList={["tasksNew"]}
            />

        )
    }

}

const loadingSelector = createLoadingSelector(['GET_MY_TASKS']);
const mapStateToProps = (state) => ({ isFetching: loadingSelector(state) });
export default connect(mapStateToProps)(UsersTasks);
