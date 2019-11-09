import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import {convertDate, orderTaskList} from '../utilities'
import {StyledAddCircleOutline} from "../css/common";
import Grid from "@material-ui/core/Grid";
import {TaskCard} from "./TaskCardsColoured";
import update from 'immutability-helper';
import moment from 'moment/min/moment-with-locales';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {
    Link,
    useLocation,
} from "react-router-dom";

export default function SessionDetail(props) {
    const theme = useTheme();
    const fullScreenModal = !useMediaQuery(theme.breakpoints.up('md'));

    const [tasks, setTasks] = useState([]);
    const [timestamp, setTimestamp] = useState(new Date());
    const [uuid, setUUID] = useState("");
    const [loaded, setLoaded] = useState(false);

    function setup() {
        props.apiControl.sessions.getSession(props.match.params.session_uuid)
            .then((session_data) => {
                if (session_data) {
                    setTasks(orderTaskList(session_data.tasks));
                    setTimestamp(session_data.timestamp);
                    setUUID(session_data.uuid);
                }
                setLoaded(true);
            });
    }

    useEffect(setup, []);


    let emptyTask = {
        session_id: props.match.params.session_uuid,
        timestamp: new Date().toISOString(),
    };

    function updateCallback(uuid, data) {
        console.log(data)
        let result = tasks.filter(task => task.uuid === uuid);
        if (result.length === 1) {
            const updated_item = {...result[0], ...data};
            const index = tasks.indexOf(result[0]);
            const updated = update(tasks, {[index]: {$set: updated_item}});
            const reordered = orderTaskList(updated);
            setTasks(reordered)

        }
    }

    const circleAdd =
        <StyledAddCircleOutline
            onClick={() => {
                let newTask = {...emptyTask};
                newTask.timestamp = moment.utc().toISOString();
                props.apiControl.tasks.createTask(newTask).then((data) => {
                    newTask.uuid = data.uuid;
                    setTasks([newTask, ...tasks])

                })
            }
            }
        />;
    let location = useLocation();

    if (loaded) {
        return (
            <div style={{paddingLeft: 30, paddingTop: 100, paddingRight: 30, paddingBottom: 100}}>
                <Grid container
                      spacing={3}
                      direction={"row"}
                      justify={"flex-start"}
                      alignItems={"center"}
                >
                    <Grid item xs={10} sm={5} md={4} lg={3}>
                        {circleAdd}
                    </Grid>
                    {tasks.map(task => {
                        return (
                            <Grid item xs={10} sm={5} md={4} lg={3} key={task.uuid}>
                                <Link style={{ textDecoration: 'none' }}
                                    key={task.uuid}
                                    to={{
                                        pathname: `/task/${task.uuid}`,
                                        state: {
                                            background: location,
                                            view: "edit",
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
                    })
                    }
                </Grid>
            </div>
        )
    } else {
        return <></>
    }
}
