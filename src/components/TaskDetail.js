import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledCard} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import {convertDate} from '../utilities'
import Grid from "@material-ui/core/Grid";

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';

function DeliverableCard(props) {
    return (
        <StyledCard>
            <CardContent>
                <h4>Deliverable</h4>
                <Typography variant="body2" component="p">
                    {props.task.name}
                </Typography>
            </CardContent>
        </StyledCard>
    )
}

class TaskDetail extends React.Component {
    componentDidMount() {
        this.props.apiControl.tasks.getTask(this.props.match.params.task_uuid)
            .then((task_data) => {
                this.setState({deliverables: task_data.deliverables});
                this.setState({uuid: task_data.uuid});
                this.setState({timestamp: task_data.timestamp});
            })
    }

    state = {
        deliverables: [],
        uuid: "",
        timestamp: new Date()
    };

    render() {
        return (
            <div>
                <p>{convertDate(this.state.timestamp)}</p>
                <Grid container
                      spacing={3}
                      justify={"center"}
                >
                    {this.state.deliverables.map((task) => (
                        <Grid item>
                            <DeliverableCard task={task} key={task.uuid}/>
                        </Grid>
                    ))}
                </Grid>
            </div>
        )
    }
}

export default TaskDetail;
