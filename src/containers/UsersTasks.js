import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {getAllMyTasks} from '../redux/Actions'
import {connect} from "react-redux"
import {makeStyles} from "@material-ui/core/styles";
import TasksGrid from "../components/TasksGrid";
import {
    useLocation,
} from "react-router-dom";

const mapStateToProps = state => {
    return {
        myTasks: state.tasks
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getTasksList: sessionId => dispatch(getAllMyTasks(sessionId)),
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
        props.getTasksList();
        setLoaded(true)
        /*props.apiControl.users.getAssignedTasks(props.match.params.user_uuid)
            .then((tasks_data) => {
                console.log(tasks_data)
                if (tasks_data) {
                    setTasks(tasks_data)
                    setLoaded(true)
                }
            });*/
    }

    useEffect(setup, []);


    let location = useLocation();
    console.log("asdf")
    console.log(props.myTasks)
    if (loaded) {
        return (
            <div style={{paddingLeft: 30, paddingTop: 100, paddingRight: 30, paddingBottom: 100}}>
                <TasksGrid tasks={props.myTasks}
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
