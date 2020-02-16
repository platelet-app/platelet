import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {addTask, getAllTasks, SET_ACTIVE_TASK_UUID, setActiveTaskUUID, getSession} from '../redux/Actions'
import {connect} from "react-redux"
import { makeStyles } from "@material-ui/core/styles";
import TasksGrid from "../components/TasksGrid";
import {decodeUUID} from "../utilities";
import { useDispatch, useSelector} from "react-redux"
import {MainWindowContainer} from "../css/common";
import {
    useLocation,
} from "react-router-dom";
import { createLoadingSelector } from '../redux/selectors';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

function SessionDetail(props) {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks);
    console.log("WOOOOOOOOOOOOOOOOOOOOT")
    //TODO: This could put data into title
    const session = useSelector(state => state.session);
    let session_uuid = decodeUUID(props.match.params.session_uuid);
    //TODO: Maybe use this to show a particular task when navigating to the task URL directly
    //const activeTask = useSelector(state => state.sessionActiveTaskUUID);
    //dispatch(setActiveTaskUUID(props.match.params.task_id));
    const theme = useTheme();
    const fullScreenModal = !useMediaQuery(theme.breakpoints.up('md'));

    const [loaded, setLoaded] = useState(false);

    function componentDidMount() {
        dispatch(getAllTasks(session_uuid));
        dispatch(getSession(session_uuid));
        setLoaded(true);
    }

    useEffect(componentDidMount, []);


    let location = useLocation();

    const classes = useStyles();

    console.log(props.isFetching)
    if (!props.isFetching) {
        return (
                <TasksGrid tasks={tasks}
                              location={location}
                              fullScreenModal={fullScreenModal}
                              onAddTaskClick={(task) => {
                                  dispatch(addTask(task));
                              }}
                              sessionUUID={session_uuid}
                              modalView={"edit"}
                />

        )
    } else {
        return <></>
    }
}

const loadingSelector = createLoadingSelector(['GET_TASKS', "GET_SESSION", "GET_AVAILABLE_DELIVERABLES", "GET_DELIVERABLES"]);
const mapStateToProps = (state) => ({ isFetching: loadingSelector(state) });
export default connect(mapStateToProps)(SessionDetail);
