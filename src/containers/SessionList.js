import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import {PaddedPaper} from '../css/common';
import Grid from "@material-ui/core/Grid";
import {addSession, clearCurrentSession, getAllSessions} from "../redux/sessions/SessionsActions";
import {useDispatch, useSelector} from "react-redux"
import {createLoadingSelector, createPostingSelector} from "../redux/selectors";

import CardsGridSkeleton from "../loadingComponents/CardsGridSkeleton";
import {setMenuIndex} from "../redux/Actions";
import SessionContextMenu from "../components/ContextMenus/SessionContextMenu";
import SessionCard from "../components/SessionCard";
import Button from "@material-ui/core/Button";
import TasksGridSkeleton from "../loadingComponents/TasksGridSkeleton";
import SessionDetail from "./SessionDetail";

const initialSnack = {snack: () => {}}

function SessionList(props) {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(["GET_SESSIONS"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const postingSelector = createPostingSelector(["ADD_SESSION"]);
    const deletingSelector = createPostingSelector(["DELETE_SESSION"]);
    const isPostingNewSession = useSelector(state => postingSelector(state));
    const isDeleting = useSelector(state => deletingSelector(state));
    const sessions = useSelector(state => state.sessions.sessions);
    const currentSessionUUID = useSelector(state => state.currentSession.session.uuid);
    const whoami = useSelector(state => state.whoami.user);
    const [snack, setSnack] = React.useState(initialSnack)
    const [isNewSession, setIsNewSession] = useState(false);

    function componentDidMount() {
        dispatch(clearCurrentSession());
    }
    useEffect(componentDidMount, [])

    useEffect(() => {setIsNewSession(!!currentSessionUUID)}, [currentSessionUUID])

    function updateSessionsList() {
        if (props.user_uuid || whoami.uuid)
            dispatch(getAllSessions(props.user_uuid ? props.user_uuid : whoami.uuid))
    }

    useEffect(updateSessionsList, [whoami]);
    useEffect(() => {
        dispatch(setMenuIndex(2))
    }, []);

    function dispatchSnack() {
        if (!isDeleting) {
            snack.snack();
            setSnack(initialSnack)
        }
    }
    useEffect(dispatchSnack, [isDeleting])

    let emptySession = {
        user_uuid: whoami.uuid,
        time_created: new Date().toISOString(),
    };

    function onStartNewSession() {
        let newSession = {...emptySession};
        newSession.user_uuid = whoami.uuid;
        dispatch(addSession(newSession));
    }

    const startNewSession =
        <Button onClick={onStartNewSession}>
            Start a new shif
            t
        </Button>

    if (isFetching) {
        return (
            <CardsGridSkeleton/>
        )
    } else if (isPostingNewSession) {
        return (
            <TasksGridSkeleton/>
        )
    } else if (isNewSession) {
        return <SessionDetail session={currentSessionUUID}/>
    } else {
        return (
            <Grid container spacing={2} direction={"column"} justify={"flex-start"} alignItems={"flex-start"}>
                <Grid item>
                    {startNewSession}
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
                                    {sessions.sort(
                                        (a, b) => new Date(b.time_created) - new Date(a.time_created)
                                    ).map((session) => (
                                        <Grid item key={session.uuid}>
                                            <div style={{cursor: 'context-menu', position: "relative"}}>
                                                    <SessionCard session={session}/>
                                                <div style={{
                                                    cursor: 'context-menu',
                                                    position: "absolute",
                                                    bottom: 0,
                                                    right: 0,
                                                    zIndex: 1000
                                                }}>
                                                    <SessionContextMenu setSnack={(snack) => {setSnack(snack)}} session={session}/>
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
