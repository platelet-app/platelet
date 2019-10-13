import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledCard} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import {convertDate} from '../utilities'
import Grid from "@material-ui/core/Grid";
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import update from 'immutability-helper';
import TaskDialog from "./TaskModal";
import {withRouter} from 'react-router-dom'


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
    constructor(props) {
        super(props)
        this.updateCallback = this.updateCallback.bind(this);

    }
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
            });
        this.props.apiControl.locations.getLocations().then((data) => {
            let filteredSuggestions = [];
            data.map((location) => {
                filteredSuggestions.push({"label": location.name})
            });
            this.setState({
                filteredLocationSuggestions: filteredSuggestions,
                locationSuggestions: data
            });
        });
        this.props.apiControl.users.getUsers().then((data) => {
            let filteredUsers = [];
            data.map((user) => {
                if (user.roles.includes("rider")) {
                    filteredUsers.push({
                        "label": user.name,
                        "uuid": user.uuid
                    })
                }
                this.setState({
                    filteredUserSuggestions: filteredUsers,
                    userSuggestions: data
                })
            });
        });

    }

    state = {
        tasks: [],
        timestamp: convertDate(new Date()),
        uuid: "",
        locationSuggestions: [],
        filteredLocationSuggestions: [],
        userSuggestions: [],
        filteredUserSuggestions: []
    };

    emptyTask = {
        session_id: this.props.match.params.session_uuid,
        timestamp: new Date().toISOString(),
    };

    updateCallback(uuid, data) {
        console.log("yaaaaaaaaaa")
        console.log(uuid, data)
        let result = this.state.tasks.filter(task => task.uuid === uuid);
        console.log(result)
        if (result.length === 1) {
            const updated_item = {...result[0], ...data};
            const index = this.state.tasks.indexOf(result[0]);
            console.log(index)
            const updated = update(this.state.tasks, {[index]: {$set: updated_item}});
            const ordered = orderTaskList(updated)
            console.log(updated)
            this.setState({
                tasks: ordered
            });

        }
    }

    render() {
        return (
            <div>
                <Grid container
                      spacing={3}
                      justify={"center"}
                >
                    <Grid item>
                                <AddCircleOutline style={{cursor: "pointer", color: "darkblue", width: "280px", height: "180px", margin: "20px 20px 20px 20px"}}
                                                  onClick={() => {
                                                      let date = new Date();
                                                      let newTask = {...this.emptyTask};
                                                      newTask.timestamp = date.toISOString();
                                                      this.setState(({
                                                          tasks: [newTask, ...this.state.tasks]
                                                      }));
                                                      this.props.apiControl.tasks.createTask(newTask).then((data) => {
                                                          const index = this.state.tasks.indexOf(newTask);
                                                          this.setState({
                                                              tasks: update(this.state.tasks, {[index]: {uuid: {$set: data.uuid}}})
                                                          })

                                                      })
                                                  }
                                                  }
                                >a</AddCircleOutline>
                    </Grid>
                    {this.state.tasks.map(task => {
                        if (task.uuid === undefined) {
                            return (
                                <Grid item key={task.uuid}>
                                    <TaskDialog uuid={task.uuid}
                                                timestamp={task.timestamp}
                                                dropoffAddress={task.dropoff_address}
                                                pickupAddress={task.pickup_address}
                                                pickupTime={task.pickup_time}
                                                dropoffTime={task.dropoff_time}
                                                assignedRider={task.rider}
                                                apiControl={this.props.apiControl}
                                                locations={this.state.locationSuggestions}
                                                suggestions={this.state.filteredLocationSuggestions}
                                                users={this.state.userSuggestions}
                                                userSuggestions={this.state.filteredUserSuggestions}
                                                updateCallback={this.updateCallback}/>
                                </Grid>
                            )
                        } else {
                            console.log(task.rider)
                            return (
                                <Grid item key={task.uuid}>
                                    <TaskDialog uuid={task.uuid}
                                                timestamp={task.timestamp}
                                                dropoffAddress={task.dropoff_address}
                                                pickupAddress={task.pickup_address}
                                                pickupTime={task.pickup_time}
                                                dropoffTime={task.dropoff_time}
                                                assignedRider={task.rider}
                                                apiControl={this.props.apiControl}
                                                locations={this.state.locationSuggestions}
                                                suggestions={this.state.filteredLocationSuggestions}
                                                users={this.state.userSuggestions}
                                                userSuggestions={this.state.filteredUserSuggestions}
                                                updateCallback={this.updateCallback}/>
                                </Grid>
                            )
                        }
                    })
                    }


                </Grid>
            </div>
        )
    }
}

export default withRouter(SessionDetail);