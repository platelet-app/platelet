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
import {addSession} from "../redux/Actions";
import {connect} from "react-redux"
import {saveAllSessions} from "../redux/Actions";
import { bindActionCreators } from "redux";

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

const mapStateToProps = state => {
    return {
        sessions: state.sessions
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddSessionClick: session =>  dispatch(addSession(session)),
        getSessionsList: userId => dispatch(saveAllSessions(userId)),

}
};

class SessList extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.apiControl.users.whoami()
            .then((my_data) => {
                this.props.getSessionsList({user_id: my_data.uuid})
                this.setState(({
                    myUUID: my_data.uuid
                }))
                /*this.props.apiControl.sessions.getSessions(my_data.uuid)
                    .then((data) => {
                        this.setState({loaded: true})
                        if (data) {
                            this.setState({
                                myUUID: my_data.uuid,
                                loaded: true
                            });
                        }
                        this.setState({
                            loaded: true
                        });
                    })*/
            })
    }

    state = {
        sessions: [],
        myUUID: "",
        loaded: true
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
                                        this.props.onAddSessionClick(newSession)

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
                {this.props.sessions.map((session) => (
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

const SessionList = connect(
    mapStateToProps,
    mapDispatchToProps
)(SessList);

export default SessionList
