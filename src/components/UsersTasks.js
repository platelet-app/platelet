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


import {
    Link,
    useLocation,
} from "react-router-dom";
import {Typography} from "@material-ui/core";

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

const getColumnTitle = key => {
    console.log(key)

    switch (key) {
        case "tasksActive":
            return <Typography><h3>Active</h3></Typography>;
        case "tasksPickedUp":
            return <Typography><h3>Picked up</h3></Typography>;
        case "tasksDelivered":
            return <Typography><h3>Delivered</h3></Typography>;
        default:
            return ""
    }
}

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
        const orderedTasks = orderTaskList(tasks)
        const allTasksGrid =
            <Grid container
                  spacing={3}
                  direction={"row"}
                  justify={"flex-start"}
                  alignItems={"stretch"}
            >
                {Object.entries(orderedTasks).map(taskList => {
                    const title = getColumnTitle(taskList[0])
                    if (taskList[0] !== "tasksNew") {
                        return (
                            <Grid item xs={10} sm={5} md={4} lg={3} key={taskList[0]}>
                                <Box height={"100%"} bgcolor={"rgba(235, 235, 235, 0.7)"} padding={"20px"} border={4}
                                     borderColor={"cornflowerblue"} borderRadius={20}>
                                    {title}
                                    <Grid container
                                          spacing={3}
                                          direction={"column"}
                                          justify={"flex-start"}
                                          alignItems={"center"}
                                    >
                                        {taskList[1].map(task => {
                                            return (
                                                <Grid item key={task.uuid}>

                                                    <Link style={{textDecoration: 'none'}}
                                                          key={task.uuid}
                                                          to={{
                                                              pathname: `/task/${task.uuid}`,
                                                              state: {
                                                                  background: location,
                                                                  view: "simple",
                                                                  fullscreen: fullScreenModal
                                                              }
                                                          }}
                                                    >
                                                        <TaskCard
                                                            title={"Task"}
                                                            pickupAddress={task.pickup_address}
                                                            dropoffAddress={task.dropoff_address}
                                                            assignedRider={task.rider}
                                                            pickupTime={task.pickup_time}
                                                            dropoffTime={task.dropoff_time}
                                                            timestamp={task.timestamp}
                                                            priority={task.priority}
                                                        />
                                                    </Link>

                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                </Box>
                            </Grid>
                        )
                    } else {
                        return <></>
                    }
                })}
            </Grid>;
        return (
            <div style={{paddingLeft: 30, paddingTop: 100, paddingRight: 30, paddingBottom: 100}}>
                {allTasksGrid}

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
