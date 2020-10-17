import React, {useEffect, useRef, useState} from 'react';
import '../../App.css';
import 'typeface-roboto'
import Grid from "@material-ui/core/Grid";
import {
    addTaskRequest,
    clearCurrentTask,
    getAllTasksRequest,
    updateTaskAssignedRiderFromSocket,
    updateTaskFromSocket,
    updateTaskRemoveAssignedRiderFromSocket,
} from '../../redux/tasks/TasksActions'
import {
    setCommentsObjectUUID,
    setMenuIndex,
    setViewMode,
    setNewTaskAddedView,
} from "../../redux/Actions";
import TasksGrid from "./components/TasksGrid";
import {
    decodeUUID,
    encodeUUID,
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
import {DashboardDetailTabs, TabPanel} from "./components/DashboardDetailTabs";
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

function Dashboard(props) {
    const loadingSelector = createLoadingSelector(['GET_TASKS', "GET_SESSION"]);
    const dispatch = useDispatch();
    const isFetching = useSelector(state => loadingSelector(state));
    const isPostingNewTaskSelector = createPostingSelector(["ADD_TASK"]);
    const isPostingNewTask = useSelector(state => isPostingNewTaskSelector(state));
    const tasks = useSelector(state => state.tasks.tasks);
    const users = useSelector(state => state.users.users);
    const viewMode = useSelector(state => state.viewMode);
    const mobileView = useSelector(state => state.mobileView);
    const notFoundSelector = createNotFoundSelector(["GET_SESSION"]);
    const notFound = useSelector(state => notFoundSelector(state));
    //TODO: This could put data into title
    const currentSession = useSelector(state => state.session.session);
    const currentTaskUUID = useSelector(state => state.currentTask.task.uuid);
    const session_uuid = props.match ? decodeUUID(props.match.params.session_uuid_b62) : currentSession.uuid;
    const firstUpdateNewTask = useRef(true);
    const firstTaskSubscribeCompleted = useRef(false);
    const whoami = useSelector(state => state.whoami.user);
    const socketSubscription = useSelector(state => state.subscription);
    const [postPermission, setPostPermission] = useState(true);

    const [rightSideBarOpen, setRightSideBarOpen] = useState(true);

    function componentDidMount() {
        dispatch(clearCurrentTask());
        dispatch(setCommentsObjectUUID(session_uuid));
        if (!viewMode) {
            const viewModeLocalStorage = getLocalStorageViewMode();
            dispatch(setViewMode(viewModeLocalStorage === null ? 0 : viewModeLocalStorage));
        }
        return function cleanup() {
            const joinedTasks = concatTasks(tasks);
            joinedTasks.forEach((task) => {
                dispatch(unsubscribeFromUUID(task.uuid))
            })
        }
    }
    useEffect(componentDidMount, []);

    function getTasks() {
        if (whoami.uuid)
            dispatch(getAllTasksRequest(whoami.uuid));
    }
    useEffect(getTasks, [whoami])

    useEffect(() => {
        if (Object.keys(socketSubscription).length === 0 && socketSubscription.constructor === Object) {
            console.log("ignore")
        } else {
            if (socketSubscription.tab_id != null && getTabIdentifier() !== socketSubscription.tab_id) {
                switch (socketSubscription.type) {
                    case "update":
                        dispatch(updateTaskFromSocket({taskUUID: socketSubscription.object_uuid, payload: socketSubscription.data}))
                        break;
                    case "assign_user":
                        const user_uuid = socketSubscription.data.user_uuid
                        const assignedUser = users.find(u => user_uuid === u.uuid)
                        if (assignedUser) {
                            const rider = assignedUser
                            dispatch(updateTaskAssignedRiderFromSocket({taskUUID: socketSubscription.object_uuid, payload: {rider, user_uuid }}))
                        }
                        break;
                    case "remove_assigned_user":
                        const user_uuid_remove = socketSubscription.data.user_uuid
                        dispatch(updateTaskRemoveAssignedRiderFromSocket({taskUUID: socketSubscription.object_uuid, payload: {user_uuid: user_uuid_remove }}))
                        break;

                    default:
                        break;
                }
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

    const emptyTask = {
        time_of_call: new Date().toISOString(),
        time_created: new Date().toISOString(),
        requester_contact: {
            name: "",
            telephone_number: ""
        },
        author_uuid: whoami.uuid,
        assigned_riders: [],
        assigned_coordinators: [],
        time_picked_up: null,
        time_dropped_off: null,
        time_rejected: null,
        time_cancelled: null
    };

    function addEmptyTask() {
        dispatch(addTaskRequest(emptyTask))
    }

    function onAddNewTask() {
        return
        // We don't want it to run the first time
        if (firstUpdateNewTask.current)
            firstUpdateNewTask.current = false;
        else if (!isPostingNewTask)
            dispatch(setNewTaskAddedView(true))
    }
    useEffect(onAddNewTask, [isPostingNewTask])

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

    if (isFetching || viewMode === null) {
        return viewMode === "stats" || props.statsView ? <StatsSkeleton/> : <TasksGridSkeleton count={4}/>
    // TODO: do the redirect to task thing here
    //} else if (newTaskAddedView()) {
    //    return <Redirect to={`/task/${encodeUUID("")}`}/>
    } else {
            return (
                <DashboardDetailTabs value={viewMode} onChange={(event, newValue) => dispatch(setViewMode(newValue))}>
                    <TabPanel value={viewMode} index={0}>
                        <TasksGrid tasks={tasks}
                                   fullScreenModal={mobileView}
                                   onAddTaskClick={addEmptyTask}
                                   modalView={"edit"}
                                   hideAddButton={!postPermission}
                                   excludeColumnList={["tasksDelivered", "tasksCancelled", "tasksRejected"]}
                        />
                    </TabPanel>
                    <TabPanel value={viewMode} index={1}>
                        <TasksGrid tasks={tasks}
                                   fullScreenModal={mobileView}
                                   onAddTaskClick={addEmptyTask}
                                   modalView={"edit"}
                                   hideAddButton={!postPermission}
                                   excludeColumnList={["tasksNew", "tasksActive", "tasksPickedUp"]}
                        />
                    </TabPanel>
                </DashboardDetailTabs>
            )
        }
}

export default Dashboard;
