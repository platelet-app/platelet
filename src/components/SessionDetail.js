import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {addTask, getAllTasks} from '../redux/Actions'
import {connect} from "react-redux"
import { makeStyles } from "@material-ui/core/styles";
import TasksGrid from "./TasksGrid";



import {
    useLocation,
} from "react-router-dom";

const mapStateToProps = state => {
    return {
        tasks: state.tasks
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddTaskClick: task => dispatch(addTask(task)),
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

function Session(props) {
    const theme = useTheme();
    const fullScreenModal = !useMediaQuery(theme.breakpoints.up('md'));

    const [tasks, setTasks] = useState([]);
    const [timestamp, setTimestamp] = useState(new Date());
    const [uuid, setUUID] = useState("");
    const [loaded, setLoaded] = useState(false);

    function setup() {
        props.getTasksList({session_id: props.match.params.session_uuid});
        props.apiControl.sessions.getSession(props.match.params.session_uuid)
            .then((session_data) => {
                if (session_data) {
                    setTimestamp(session_data.timestamp);
                    setUUID(session_data.uuid);
                }
                setLoaded(true);
            });
    }

    useEffect(setup, []);


    let location = useLocation();

    const classes = useStyles();

    if (loaded) {
        return (
            <div style={{paddingLeft: 30, paddingTop: 100, paddingRight: 30, paddingBottom: 100}}>
                <TasksGrid tasks={props.tasks}
                              location={location}
                              fullScreenModal={fullScreenModal}
                              onAddTaskClick={props.onAddTaskClick}
                              sessionUUID={props.match.params.session_uuid}
                              modalView={"edit"}
                />

            </div>
        )
    } else {
        return <></>
    }
}

const SessionDetail = connect(
    mapStateToProps,
    mapDispatchToProps
)(Session)

export default SessionDetail
