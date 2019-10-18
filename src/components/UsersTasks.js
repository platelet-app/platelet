import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import '../App.css';
import 'typeface-roboto'
import {StyledCard} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import {withStyles} from '@material-ui/styles';
import { orderTaskList } from '../utilities'
import Grid from "@material-ui/core/Grid";
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import update from 'immutability-helper';
import TaskDialog from "./TaskModal";
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';


class UsersTasks extends React.Component {
    constructor(props) {
        super(props);
        this.updateCallback = this.updateCallback.bind(this);

    }

    componentDidMount() {
        this.props.apiControl.users.getAssignedTasks(this.props.match.params.user_uuid)
            .then((tasks_data) => {
                if (tasks_data) {
                    this.setState({
                        tasks: orderTaskList(tasks_data)
                    });
                }
            });
    }

    state = {
        tasks: [],
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
            <div style={{marginLeft: 30, marginTop: 100, marginRight: 30, marginBottom: 100}}>
                <Grid container
                      spacing={3}
                      direction={"row"}
                      justify={"flex-start"}
                      alignItems={"center"}
                >
                    {this.state.tasks.map(task => {
                        return (
                            <Grid item xs={10} sm={5} md={4} lg={3} key={task.uuid}>
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
                                            updateCallback={this.updateCallback}
                                            riderView={true}/>
                            </Grid>
                        )
                    })
                    }


                </Grid>
            </div>
        )
    }
}

export default UsersTasks;