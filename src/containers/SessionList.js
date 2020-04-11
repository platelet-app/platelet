import React, {useEffect} from 'react';
import '../App.css';
import 'typeface-roboto'
import {PaddedPaper, StyledCard} from '../css/common';
import {AddCircleButton} from '../components/Buttons';
import CardContent from '@material-ui/core/CardContent';
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import Moment from "react-moment";
import {addSession, getAllSessions} from "../redux/sessions/Actions";
import {useDispatch, useSelector} from "react-redux"
import {encodeUUID} from "../utilities";
import {createLoadingSelector, createPostingSelector} from "../redux/selectors";

import CardsGridSkeleton from "../loadingComponents/CardsGridSkeleton";
import {setMenuIndex} from "../redux/Actions";
import CardItem from "../components/CardItem";
import SessionContextMenu from "../components/SessionContextMenu";
import moment from "moment";

function SessionCard(props) {
    const momentDisplay =
        moment(props.session.time_created).isAfter(moment().subtract(3, "days")) ?
            <Moment fromNow>{props.session.time_created}</Moment> :
            <Moment format={"llll"}>{props.session.time_created}</Moment>;

    return (
        <div key={props.session.uuid}>
            <StyledCard style={{height: "120px"}}>
                <CardContent>
                    <Grid containerspacing={1} direction={"column"}>
                        <CardItem label={"Started"}>
                            <Moment calendar>{props.session.time_created}</Moment>
                        </CardItem>
                        <CardItem
                            label={"Tasks"}>{props.session.task_count ? props.session.task_count : "0"}
                        </CardItem>
                    </Grid>
                </CardContent>
            </StyledCard>
        </div>
    )
}


function SessionList(props) {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(["GET_SESSIONS"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const postingSelector = createPostingSelector(["ADD_SESSION"]);
    const isPosting = useSelector(state => postingSelector(state));
    const sessions = useSelector(state => state.sessions);
    const whoami = useSelector(state => state.whoami);

    function updateSessionsList() {
        if (props.user_uuid || whoami.uuid)
            dispatch(getAllSessions(props.user_uuid ? props.user_uuid : whoami.uuid))
    }

    useEffect(updateSessionsList, [whoami]);
    useEffect(() => {
        dispatch(setMenuIndex(2))
    }, []);


    let emptySession = {
        user_uuid: whoami.uuid,
        time_created: new Date().toISOString(),
    };
    const circleAdd =
        <AddCircleButton disabled={isPosting} onClick={
            () => {
                let newSession = {...emptySession};
                newSession.user_uuid = whoami.uuid;
                dispatch(addSession(newSession));

            }
        }/>;

    if (isFetching) {
        return (
            <CardsGridSkeleton/>
        )
    } else {
        return (
            <Grid container spacing={2} direction={"column"} justify={"flex-start"} alignItems={"flex-start"}>
                <Grid item>
                    {circleAdd}
                </Grid>
                <Grid item>
                    <PaddedPaper>
                        <Grid container spacing={1} direction={"row"} justify={"flex-start"} alignItems={"center"}>
                            <Grid item>
                                <Grid container
                                      spacing={3}
                                      direction={"row"}
                                      justify={"flex-start"}
                                      alignItems={"center"}
                                >
                                    {sessions.sort((a, b) => new Date(b.time_created) - new Date(a.time_created)).map((session) => (
                                        <Grid item key={session.uuid}>
                                            <div style={{cursor: 'context-menu', position: "relative"}}>
                                                <Link to={"/session/" + encodeUUID(session.uuid)}
                                                      style={{textDecoration: 'none'}}>
                                                    <SessionCard session={session}/>
                                                </Link>
                                                <div style={{
                                                    cursor: 'context-menu',
                                                    position: "absolute",
                                                    bottom: 0,
                                                    right: 0,
                                                    zIndex: 1000
                                                }}>
                                                    <SessionContextMenu sessionUUID={session.uuid}/>
                                                </div>
                                            </div>
                                        </Grid>
                                    ))
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </PaddedPaper>
                </Grid>
            </Grid>
        )
    }
}

export default SessionList;
