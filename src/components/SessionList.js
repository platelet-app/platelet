import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledCard} from '../css/common';
//import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from "@material-ui/core";
import {convertDate} from '../utilities'
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
                        <Typography className={classes.title}>Session {props.session.uuid}</Typography>
                        <Typography variant="body2" component="p">
                            {convertDate(props.session.timestamp)}
                        </Typography>
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
                            this.setState({sessions: data});
                        }
                    })
            })
    }

    state = {
        sessions: []
    };

    render() {
        return (
            <div>
                <h1>Sessions</h1>
                {this.state.sessions.map((session) => (
                    <div key={session.uuid}>
                        <Link to={"/session/" + session.uuid} style={{ textDecoration: 'none' }}>
                            <SessionCard session={session}/>
                        </Link>
                    </div>
                ))
                }

            </div>
        )
    }
}

export default SessionsList;
