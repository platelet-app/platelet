import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledCard} from '../css/common';
//import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import {convertDate} from '../utilities'
import Grid from "@material-ui/core/Grid";
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import update from 'immutability-helper';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import SessionDetail from "./SessionDetail";
import Control from '../ApiControl'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles({
    card: {
        minWidth: 275,
    },
    title: {
        fontSize: 20,
    },
    pos: {
        marginBottom: 12,
    },
});


function SessionCard(props) {
    const classes = useStyles();
    return (
        <div>
            <div key={props.session.uuid}>
                <StyledCard className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title}>Session on {convertDate(props.session.timestamp)} with {props.session.task_count} tasks recorded.</Typography>
                    </CardContent>
                </StyledCard>
            </div>
        </div>
    )
}

class SessionsList extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.apiControl.users.whoami()
            .then((my_data) => {
                this.props.apiControl.sessions.getSessions(my_data.uuid)
                    .then((data) => {
                        if (data) {
                            this.setState({
                                sessions: data,
                                myUUID: my_data.uuid
                            });
                        }
                    })
            })
    }

    state = {
        sessions: [],
        myUUID: ""
    };

    emptySession = {
        user_id: this.state.myUUID,
        timestamp: new Date().toISOString(),
    };

    render() {
        return (
            <div>
                <h1>Sessions</h1>
                <Grid container
                      spacing={3}
                      justify={"center"}
                >
                <Grid item>
                    <AddCircleOutline style={{cursor: "pointer", color: "darkblue", width: "280px", height: "180px", margin: "20px 20px 20px 20px"}}
                                      onClick={() => {
                                          let date = new Date();
                                          let newSession = {...this.emptySession};
                                          newSession.user_id = this.state.myUUID;
                                          newSession.timestamp = date.toISOString();
                                          this.setState(({
                                              sessions: [newSession, ...this.state.sessions]
                                          }));
                                          this.props.apiControl.sessions.createSession(newSession).then((data) => {
                                              const index = this.state.sessions.indexOf(newSession);
                                              this.setState({
                                                  sessions: update(this.state.sessions, {[index]: {uuid: {$set: data.uuid}}})
                                              })

                                          })
                                      }
                                      }
                    >a</AddCircleOutline>
                </Grid>
                {this.state.sessions.map((session) => (
                    <Grid item key={session.uuid}>
                        <Link to={"/session/" + session.uuid} style={{ textDecoration: 'none' }}>
                            <SessionCard session={session}/>
                        </Link>
                    </Grid>
                ))
                }
                </Grid>

            </div>
        )
    }
}

export default SessionsList;
