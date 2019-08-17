import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledCard, TaskActive, TaskAdded, TaskAssigned, TaskDelivered, TaskNew} from '../css/common';
import {TaskCard} from "./TaskCardsColoured";
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import {convertDate} from '../utilities'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import update from 'immutability-helper';

function orderTaskList(tasks) {
    let tasksNew = [];
    let tasksActive = [];
    let tasksPickedUp = [];
    let tasksDelivered = [];
    tasks.forEach((task) => {
        if (task.assigned_rider === null) {
            tasksNew.unshift(task);
        } else if (task.assigned_rider && !task.pickup_time) {
            tasksActive.unshift(task);
        } else if (task.assigned_rider && task.pickup_time && !task.dropoff_time) {
            tasksPickedUp.unshift(task);
        } else if (task.dropoff_time) {
            tasksDelivered.unshift(task);
        } else {
            tasksNew.unshift(task);
        }
    });

    let result = [];
    result = result.concat(tasksNew);
    result = result.concat(tasksActive);
    result = result.concat(tasksPickedUp);
    result = result.concat(tasksDelivered);
    return result;
}

class SessionDetail extends React.Component {
    componentDidMount() {
        this.props.apiControl.sessions.getSession(this.props.match.params.session_uuid)
            .then((session_data) => {
                if (session_data) {
                    this.setState({
                        tasks: orderTaskList(session_data.tasks),
                        timestamp: session_data.timestamp,
                        uuid: session_data.uuid
                    });
                }
            })
    }

    state = {
        tasks: [],
        timestamp: convertDate(new Date()),
        uuid: ""
    };

    emptyTask = {
        session_id: this.props.match.params.session_uuid,
        timestamp: new Date().toISOString()
    };

    render() {
        console.log(this.state.tasks)
        return (
            <div>
                <Grid container
                      spacing={3}
                      justify={"center"}
                >
                    <Grid item>
                        <StyledCard>
                            <CardContent>
                                <AddCircleOutline style={{fontSize: 100, cursor: "pointer"}}
                                                  onClick={() => {
                                                      let date = new Date()
                                                      let newTask = {...this.emptyTask};
                                                      newTask.timestamp = date.toISOString()
                                                      this.setState(prevState => ({
                                                          tasks: [newTask, ...prevState.tasks]
                                                      }))
                                                      this.props.apiControl.tasks.createTask(newTask).then((data) => {
                                                          this.setState({
                                                              tasks: update(this.state.tasks, {0: {uuid: {$set: data.uuid}}})
                                                          })

                                                      })
                                                  }
                                                  }
                                ></AddCircleOutline>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                    {this.state.tasks.map((task) => (
                        <Grid item>
                            <Link to={"/task/" + task.uuid} style={{textDecoration: 'none'}}>
                                <TaskCard task={task} key={task.uuid}/>
                            </Link>
                        </Grid>
                    ))}


                </Grid>
            </div>
        )
    }
}

export default SessionDetail;
