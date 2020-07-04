import React, {useEffect, useRef, useState} from 'react';
import '../../App.css';
import 'typeface-roboto'
import Grid from "@material-ui/core/Grid";
import {
    addTask, clearCurrentTask,
    getAllTasks,
    refreshAllTasks, updateTaskFromSocket, updateTaskSuccess,
} from '../../redux/tasks/TasksActions'
import {
    setCommentsObjectUUID,
    setMenuIndex,
    setViewMode,
    setNewTaskAddedView,
    setHideDelivered
} from "../../redux/Actions";
import {
    getSession,
    refreshCurrentSession,
} from "../../redux/sessions/SessionsActions";
import TasksGrid from "./components/TasksGrid";
import {
    decodeUUID,
    encodeUUID,
    getLocalStorageHideDelivered,
    getLocalStorageViewMode,
    getTabIdentifier
} from "../../utilities";
import {useDispatch, useSelector} from "react-redux"
import {createLoadingSelector, createNotFoundSelector, createPostingSelector} from "../../redux/selectors";
import TasksGridSkeleton from "./components/TasksGridSkeleton";
import TasksTable from "./components/TasksTable";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Menu from "@material-ui/core/Menu";
import {Typography} from "@material-ui/core";
import TasksStatistics from "./components/TasksStatistics";
import StatsSkeleton from "./components/StatsSkeleton";
import PersistentDrawerRight from "./components/SideInfoSection";
import ChatIcon from "@material-ui/icons/Chat";
import Tooltip from "@material-ui/core/Tooltip";
import NotFound from "../../ErrorComponents/NotFound";
import {Redirect, useHistory} from "react-router";
import {SessionDetailTabs, TabPanel} from "./components/SessionDetailTabs";
import {subscribeToUUID, unsubscribeFromUUID} from "../../redux/sockets/SocketActions";
import {concatTasks} from "./utilities";

function GetViewTitle(props) {
    switch (props.type) {
        case "kanban":
            return <Typography>Kanban</Typography>;
        case "table":
            return <Typography>Table</Typography>;
        case "stats":
            return <Typography>Statistics</Typography>;
        default:
            return <Typography></Typography>;

    }
}

function SessionDetail(props) {
    const loadingSelector = createLoadingSelector(['GET_TASKS', "GET_SESSION"]);
    const dispatch = useDispatch();
    const isFetching = useSelector(state => loadingSelector(state));
    const isPostingNewTaskSelector = createPostingSelector(["ADD_TASK"]);
    const isPostingNewTask = useSelector(state => isPostingNewTaskSelector(state));
    const tasks = useSelector(state => state.tasks.tasks);
    const viewMode = useSelector(state => state.viewMode);
    const hideDelivered = useSelector(state => state.hideDelivered);
    const mobileView = useSelector(state => state.mobileView);
    const notFoundSelector = createNotFoundSelector(["GET_SESSION"]);
    const notFound = useSelector(state => notFoundSelector(state));
    //TODO: This could put data into title
    const currentSession = useSelector(state => state.session.session);
    const currentTaskUUID = useSelector(state => state.currentTask.task.uuid);
    const session_uuid = props.match ? decodeUUID(props.match.params.session_uuid_b62) : currentSession.uuid;
    const history = useHistory();
    const firstUpdateNewTask = useRef(true);
    const firstTaskSubscribeCompleted = useRef(false);
    const whoami = useSelector(state => state.whoami.user);
    const socketSubscription = useSelector(state => state.subscription);
    const [postPermission, setPostPermission] = useState(false);

    const [rightSideBarOpen, setRightSideBarOpen] = useState(true);

    function componentDidMount() {
        dispatch(clearCurrentTask());
        dispatch(getAllTasks(session_uuid));
        dispatch(getSession(session_uuid))
        dispatch(setCommentsObjectUUID(session_uuid));
        if (!viewMode) {
            const viewModeLocalStorage = getLocalStorageViewMode();
            dispatch(setViewMode(viewModeLocalStorage === null ? 0 : viewModeLocalStorage));
        }
        if (hideDelivered === null) {
            const hideDeliveredLocalStorage = getLocalStorageHideDelivered();
            dispatch(setHideDelivered(hideDeliveredLocalStorage === null ? false : JSON.parse(hideDeliveredLocalStorage)))
        }
        if (!props.match) {
            history.push(`/session/${encodeUUID(currentSession.uuid)}`);
        }
        return function cleanup() {
            const joinedTasks = concatTasks(tasks);
            joinedTasks.forEach((task) => {
                dispatch(unsubscribeFromUUID(task.uuid))
            })
        }
    }

    useEffect(componentDidMount, []);

    useEffect(() => {
        if (Object.keys(socketSubscription).length === 0 && socketSubscription.constructor === Object) {
            console.log("ignore")
        } else {
            if (socketSubscription.tab_id != null && getTabIdentifier() !== socketSubscription.tab_id) {
                dispatch(updateTaskFromSocket({taskUUID: socketSubscription.object_uuid, payload: socketSubscription.data}))
                console.log(socketSubscription.data)
            } else
                console.log("this came from us")
        }

    }, [socketSubscription])

    function subscribeTasks() {
        const joinedTasks = concatTasks(tasks);
        if (joinedTasks.length !== 0 && !firstTaskSubscribeCompleted.current) {
            firstTaskSubscribeCompleted.current = true;
            joinedTasks.forEach(task => dispatch(subscribeToUUID(task.uuid)))
        }
        if (firstTaskSubscribeCompleted)
            tasks.tasksNew.forEach(task => dispatch(subscribeToUUID(task.uuid)))
    }
    useEffect(subscribeTasks, [tasks])

    useEffect(() => {
        const permission = whoami.uuid === currentSession.coordinator_uuid || currentSession.collaborators.map((u) => u.uuid).includes(whoami.uuid);
        setPostPermission(permission);
        },[currentSession])


    const emptyTask = {
        session_uuid: session_uuid,
        time_of_call: new Date().toISOString(),
        time_created: new Date().toISOString(),
        assigned_users: [],
        assigned_users_display_string: "",
        time_picked_up: null,
        time_dropped_off: null,
        time_rejected: null,
        time_cancelled: null

    };

    function addEmptyTask() {
        dispatch(addTask(emptyTask))
    }

    function setNewTaskAdded() {
        return
        // We don't want it to run the first time
        if (firstUpdateNewTask.current)
            firstUpdateNewTask.current = false;
        else if (!isPostingNewTask)
            dispatch(setNewTaskAddedView(true))
    }

    useEffect(setNewTaskAdded, [isPostingNewTask])

    useEffect(() => {
        dispatch(setMenuIndex(2))
    }, []);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const modeToggle = mobileView || props.statsView ? <></> :
        <Grid container
              spacing={1}
              direction={"row"}
              justify={"flex-start"}
              alignItems={"center"}
        >
            <Grid item>
                <Tooltip title="Change mode">
                    <IconButton
                        color="inherit"
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={(event) => {
                            setAnchorEl(event.currentTarget);
                        }}>
                        <GetViewTitle type={viewMode}/>
                        <ArrowDropDownIcon/>
                    </IconButton>
                </Tooltip>
                <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={() => {
                        setAnchorEl(null);
                    }}
                >
                    <MenuItem selected={viewMode === "kanban"} onClick={() => {
                        setAnchorEl(null);
                        dispatch(setViewMode("kanban"))
                    }}>
                        <Typography>Kanban</Typography>
                    </MenuItem>
                    <MenuItem selected={viewMode === "table"} onClick={() => {
                        setAnchorEl(null);
                        dispatch(setViewMode("table"))
                    }}>
                        <Typography>Table</Typography>
                    </MenuItem>
                    <MenuItem selected={viewMode === "stats"} onClick={() => {
                        setAnchorEl(null);
                        dispatch(setViewMode("stats"))
                    }}>
                        <Typography>Statistics</Typography>
                    </MenuItem>
                </Menu>

            </Grid>
            <Grid item>
                <Tooltip title="View comments">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setRightSideBarOpen(!rightSideBarOpen)}
                    >
                        <ChatIcon/>
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    ;

    if (false) {
    //if (newTaskAddedView) {
        if (currentTaskUUID) {
            //TODO: for some reason this makes the session in the background disappear
            return <Redirect to={`/session/${encodeUUID(session_uuid)}/task/${encodeUUID(currentTaskUUID)}`}/>
        }
    }
    if (isFetching || viewMode === null) {
        return viewMode === "stats" || props.statsView ? <StatsSkeleton/> : <TasksGridSkeleton count={4}/>
    } else if (notFound) {
        return <NotFound>{`Session with UUID ${session_uuid} not found.`}</NotFound>
    } else {
            return (
                <SessionDetailTabs hideDelivered={hideDelivered} value={viewMode} onChange={(event, newValue) => dispatch(setViewMode(newValue))}>
                    <TabPanel value={viewMode} index={0}>
                        <TasksGrid tasks={tasks}
                                   fullScreenModal={mobileView}
                                   onAddTaskClick={addEmptyTask}
                                   sessionUUID={session_uuid}
                                   modalView={"edit"}
                                   hideDelivered={hideDelivered}
                                   hideAddButton={!postPermission}
                        />
                    </TabPanel>
                    <TabPanel value={viewMode} index={1}>
                        <TasksTable tasks={tasks}
                                    fullScreenModal={mobileView}
                                    onAddTaskClick={addEmptyTask}
                                    sessionUUID={session_uuid}
                                    modalView={"edit"}
                                    hideDelivered={hideDelivered}
                        />
                    </TabPanel>
                    <TabPanel value={viewMode} index={2}>
                        <TasksStatistics tasks={tasks} sessionUUID={session_uuid}/>
                    </TabPanel>
                </SessionDetailTabs>
            )
        }




    if (viewMode === "stats" || props.statsView) {
        return (
            <PersistentDrawerRight open={rightSideBarOpen}
                                   handleDrawerToggle={() => setRightSideBarOpen(!rightSideBarOpen)}
                                   handleDrawerClose={() => setRightSideBarOpen(false)}>
                {modeToggle}
                <TasksStatistics tasks={tasks} sessionUUID={session_uuid}/>
            </PersistentDrawerRight>
        )
    } else if (viewMode === "kanban" || mobileView) {
        return (
            <PersistentDrawerRight open={rightSideBarOpen}
                                   handleDrawerToggle={() => setRightSideBarOpen(!rightSideBarOpen)}
                                   handleDrawerClose={() => setRightSideBarOpen(false)}>
                {modeToggle}
                <TasksGrid tasks={tasks}
                           fullScreenModal={mobileView}
                           onAddTaskClick={addEmptyTask}
                           sessionUUID={session_uuid}
                           modalView={"edit"}
                />
            </PersistentDrawerRight>

        )
    } else if (viewMode === "table") {
        return (
            <PersistentDrawerRight open={rightSideBarOpen}
                                   handleDrawerToggle={() => setRightSideBarOpen(!rightSideBarOpen)}
                                   handleDrawerClose={() => setRightSideBarOpen(false)}>
                {modeToggle}
                <TasksTable tasks={tasks}
                            fullScreenModal={mobileView}
                            onAddTaskClick={addEmptyTask}
                            sessionUUID={session_uuid}
                            modalView={"edit"}
                />
            </PersistentDrawerRight>
        )
    } else {
        return (
            <></>
        )
    }

}

export default SessionDetail;
