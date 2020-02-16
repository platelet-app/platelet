import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {getAllMyTasks} from '../redux/Actions'
import {connect, useDispatch, useSelector} from "react-redux"
import TasksGrid from "../components/TasksGrid";
import {
    useLocation,
} from "react-router-dom";
import {createLoadingSelector} from "../redux/selectors";

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
    if (!props.isFetching) {
        return (
            <TasksGrid tasks={tasks}
                       location={location}
                       fullScreenModal={fullScreenModal}
                       modalView={"simple"}
                       excludeColumnList={["tasksNew"]}
            />

        )
    } else {
        return <></>
    }

}

const loadingSelector = createLoadingSelector(['GET_TASKS', "GET_SESSION", "GET_AVAILABLE_DELIVERABLES", "GET_DELIVERABLES"]);
const mapStateToProps = (state) => ({ isFetching: loadingSelector(state) });
export default connect(mapStateToProps)(UsersTasks);
