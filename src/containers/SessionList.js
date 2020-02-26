import React, {useEffect} from 'react';
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
import {addSession, clearLoading, getAllVehicles} from "../redux/Actions";
import {connect, useDispatch, useSelector} from "react-redux"
import {getAllSessions} from "../redux/Actions";
import {encodeUUID} from "../utilities";
import {bindActionCreators} from "redux";
import {createLoadingSelector} from "../redux/selectors";

import CardsGridSkeleton from "../loadingComponents/CardsGridSkeleton";

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
                        <Typography className={classes.title}>Session on <Moment
                            format={"llll"}>{props.session.timestamp}</Moment> with {props.session.task_count ? props.session.task_count : 0} tasks
                            recorded.</Typography>
                    </CardContent>
                </StyledCard>
            </div>
        </div>
    )
}


function SessionList(props) {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(["GET_SESSIONS"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const sessions = useSelector(state => state.sessions);
    const whoami = useSelector(state => state.whoami);

    function updateSessionsList() {
        if (whoami.uuid)
            dispatch(getAllSessions(whoami.uuid))
    }

    useEffect(updateSessionsList, [whoami]);


    let emptySession = {
        user_id: whoami.uuid,
        timestamp: new Date().toISOString(),
    };

    const circleAdd =
        <StyledAddCircleOutline
            onClick={() => {
                let date = new Date();
                let newSession = {...emptySession};
                newSession.user_id = whoami.uuid;
                newSession.timestamp = date.toISOString();
                dispatch(addSession(newSession));

            }
            }
        />;
    if (isFetching) {
        return (
            <CardsGridSkeleton/>
        )
    } else {
        return (
            <Grid container
                  spacing={3}
                  direction={"row"}
                  justify={"flex-start"}
                  alignItems={"center"}
            >
                <Grid item xs={10} sm={5} md={4} lg={3}>
                    {circleAdd}
                </Grid>
                {sessions.map((session) => (
                    <Grid item xs={10} sm={5} md={4} lg={3} key={session.uuid}>
                        <Link to={"/session/" + encodeUUID(session.uuid)} style={{textDecoration: 'none'}}>
                            <SessionCard session={session}/>
                        </Link>
                    </Grid>
                ))
                }
            </Grid>)
    }
}

export default SessionList;
