import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledCard} from '../css/common';
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

function TaskCard(props) {
    return (
        <StyledCard>
            <CardContent>
                <h4>Task</h4>
                <Typography variant="body2" component="p">
                    {convertDate(props.task.timestamp)}
                </Typography>
            </CardContent>
        </StyledCard>
    )
}

class SessionDetail extends React.Component {
    componentDidMount() {
        this.props.apiControl.sessions.get_session(this.props.match.params.session_uuid)
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
                <Grid container
                      spacing={3}
                      justify={"center"}
                >
                    <Grid item>
                        <StyledCard>
                        <CardContent>
                            <AddCircleOutline style={{ fontSize: 100 }}></AddCircleOutline>
                        </CardContent>
                    </StyledCard>
                    </Grid>
                    {this.state.tasks.map((task) => (
                        <Grid item>
                            <Link to={"/task/" + task.uuid} style={{ textDecoration: 'none' }}>
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
