import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledAddCircleOutline, StyledCard} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import {convertDate} from '../utilities'
import Grid from "@material-ui/core/Grid";
import update from 'immutability-helper';
import {Link} from "react-router-dom";
import Moment from "react-moment";

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
                <StyledCard>
                    <CardContent>
                        <Typography className={classes.title}>Session on <Moment format={"llll"}>{props.session.timestamp}</Moment> with {props.session.task_count ? props.session.task_count : 0} tasks recorded.</Typography>
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
                                myUUID: my_data.uuid,
                                loaded: true
                            });
                        }
                        this.setState({
                            loaded: true
                        });
                    })
            })
    }

    state = {
        sessions: [],
        myUUID: "",
        loaded: false
    };

    emptySession = {
        user_id: this.state.myUUID,
        timestamp: new Date().toISOString(),
    };

    render() {
        const circleAdd =
            <StyledAddCircleOutline
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
            />;
        let addButton;
        if (this.state.loaded) {
            addButton = circleAdd
        } else {
            addButton = <></>
        }
        return (
            <div style={{marginLeft: 30, marginTop: 100, marginRight: 30, marginBottom: 100}}>
                <Grid container
                      spacing={3}
                      direction={"row"}
                      justify={"flex-start"}
                      alignItems={"center"}
                >
                <Grid item xs={10} sm={5} md={4} lg={3}>
                    {addButton}
                </Grid>
                {this.state.sessions.map((session) => (
                    <Grid item xs={10} sm={5} md={4} lg={3} key={session.uuid}>
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
