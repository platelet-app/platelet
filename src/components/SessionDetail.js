import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import '../App.css';
import 'typeface-roboto'
import {StyledCard} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/styles';
import {convertDate, orderTaskList} from '../utilities'
import Grid from "@material-ui/core/Grid";
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import update from 'immutability-helper';
import TaskDialog from "./TaskModal";
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';


class SessionDetail extends React.Component {
    constructor(props) {
        super(props);
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
            console.log(data)
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
        let result = this.state.tasks.filter(task => task.uuid === uuid);
        if (result.length === 1) {
            const updated_item = {...result[0], ...data};
            const index = this.state.tasks.indexOf(result[0]);
            const updated = update(this.state.tasks, {[index]: {$set: updated_item}});
            const reordered = orderTaskList(updated);
            this.setState({
                tasks: reordered
            });

        }
    }

    render() {
        return (
            <div style={{marginLeft: 30, marginTop: 100, marginRight: 30, marginBottom: 100} }>
                <Grid container
                      spacing={3}
                      justify={"center"}
                >
                    <Grid item>
                                <AddCircleOutline style={{cursor: "pointer", color: "darkblue", width: "280px", height: "180px", margin: "20px 20px 20px 20px"}}
                                                  onClick={() => {
                                                      let date = new Date();
                                                      let nowUtc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                                                          date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
                                                      let utcDate = new Date(nowUtc);
                                                      let newTask = {...this.emptyTask};
                                                      newTask.timestamp = utcDate.toISOString();
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

SessionDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default SessionDetail;
