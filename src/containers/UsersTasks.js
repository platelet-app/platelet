import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {getAllMyTasks} from '../redux/Actions'
import {useDispatch, useSelector} from "react-redux"
import TasksGrid from "../components/TasksGrid";
import {
    useLocation,
} from "react-router-dom";

function UsersTasks() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const fullScreenModal = !useMediaQuery(theme.breakpoints.up('md'));

    const [loaded, setLoaded] = useState(false);

    function componentDidMount() {
        dispatch(getAllMyTasks());
        setLoaded(true)
    }
    const tasks = useSelector(state => state.tasks);

    useEffect(componentDidMount, []);


    let location = useLocation();
    if (loaded) {
        return (
            <div style={{paddingLeft: 30, paddingTop: 100, paddingRight: 30, paddingBottom: 100}}>
                <TasksGrid tasks={tasks}
                              location={location}
                              fullScreenModal={fullScreenModal}
                              modalView={"simple"}
                              excludeColumnList={["tasksNew"]}
                />

            </div>
        )
    } else {
        return <></>
    }

}

export default UsersTasks
