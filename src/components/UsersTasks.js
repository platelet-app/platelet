import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import {convertDate, orderTaskList} from '../utilities'
import {StyledAddCircleOutline} from "../css/common";
import Grid from "@material-ui/core/Grid";
import {TaskCard} from "./TaskCardsColoured";
import update from 'immutability-helper';
import moment from 'moment/min/moment-with-locales';
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {addTask, getAllTasks} from '../redux/Actions'
import {connect} from "react-redux"
import store from "../redux/Store"
import {makeStyles} from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import TaskItem from "./TaskItem";
import TasksGrid from "./TasksGrid";
import {
    Link,
    useLocation,
} from "react-router-dom";
import {Typography} from "@material-ui/core";
import Container from "@material-ui/core/Container";

const mapStateToProps = state => {
    return {
        tasksSoon: state.tasks
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getTasksList: sessionId => dispatch(getAllTasks(sessionId)),
    }
};

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


function UsersSession(props) {
    const theme = useTheme();
    const fullScreenModal = !useMediaQuery(theme.breakpoints.up('md'));

    const [tasks, setTasks] = useState([]);
    const [timestamp, setTimestamp] = useState(new Date());
    const [uuid, setUUID] = useState("");
    const [loaded, setLoaded] = useState(false);

    function setup() {
        props.apiControl.users.getAssignedTasks(props.match.params.user_uuid)
            .then((tasks_data) => {
                console.log(tasks_data)
                if (tasks_data) {
                    setTasks(tasks_data)
                    setLoaded(true)
                }
            });
    }

    useEffect(setup, []);


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

const UsersTasks = connect(
    mapStateToProps,
    mapDispatchToProps
)(UsersSession);

export default UsersTasks
