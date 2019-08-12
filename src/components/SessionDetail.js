import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledCard} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import {convertDate} from '../utilities'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';

function TaskCard(props) {
    return (
        <StyledCard>
            <CardContent>
                <h4>Task</h4>
                <Typography variant="body2" component="p">
                    {convertDate(props.task.timestamp)}
                    <br></br>
                    {props.task.contact_number}
                </Typography>
            </CardContent>
        </StyledCard>
    )
}

class SessionDetail extends React.Component {
    componentDidMount() {
        this.props.api_control.sessions.get_session(this.props.match.params.session_uuid)
            .then((session_data) => {
                this.setState({tasks: session_data.tasks});
                this.setState({timestamp: session_data.timestamp});
                this.setState({uuid: session_data.uuid});
            })
    }

    state = {
        tasks: [],
        timestamp: convertDate(new Date()),
        uuid: ""
    };

    render() {
        return (
            <div>
                <p>{convertDate(this.state.timestamp)}</p>
                <p>{this.state.uuid}</p>
                {this.state.tasks.map((task) => (
                    <TaskCard task={task} key={task.uuid}/>
                ))}
            </div>
        )
    }
}

export default SessionDetail;
