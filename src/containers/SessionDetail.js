import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import Grid from "@material-ui/core/Grid";
import {
    addTask,
    getAllTasks,
} from '../redux/tasks/TasksActions'
import {setCommentsObjectUUID, setMenuIndex, setViewMode} from "../redux/Actions";
import {getSession} from "../redux/sessions/SessionsActions";
import TasksGrid from "../components/TasksGrid";
import {decodeUUID, getLocalStorageViewMode} from "../utilities";
import {useDispatch, useSelector} from "react-redux"
import {useLocation} from "react-router-dom";
import {createLoadingSelector} from '../redux/selectors';
import TasksGridSkeleton from "../loadingComponents/TasksGridSkeleton";
import TasksTable from "../components/TasksTable";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Menu from "@material-ui/core/Menu";
import {Typography} from "@material-ui/core";
import TasksStatistics from "../components/TasksStatistics";
import StatsSkeleton from "../loadingComponents/StatsSkeleton";
import PersistentDrawerRight from "./SideInfoSection";
import ChatIcon from "@material-ui/icons/Chat";

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
    const tasks = useSelector(state => state.tasks);
    const viewMode = useSelector(state => state.viewMode);
    const mobileView = useSelector(state => state.mobileView);
    //TODO: This could put data into title
    const session = useSelector(state => state.session);
    let session_uuid = decodeUUID(props.match.params.session_uuid_b62);
    //TODO: Maybe use this to show a particular task when navigating to the task URL directly
    //const activeTask = useSelector(state => state.sessionActiveTaskUUID);
    //dispatch(setActiveTaskUUID(props.match.params.task_uuid_b62));

    const [rightSideBarOpen, setRightSideBarOpen] = useState(true);


    function componentDidMount() {
        dispatch(getAllTasks(session_uuid));
        dispatch(getSession(session_uuid));

        dispatch(setCommentsObjectUUID(session_uuid));
        if (!viewMode) {
            const viewModeLocalStorage = getLocalStorageViewMode();
            if (viewModeLocalStorage === null)
                dispatch(setViewMode("kanban"));
            else
                dispatch(setViewMode(viewModeLocalStorage));
        }
    }

    useEffect(componentDidMount, []);
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
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setRightSideBarOpen(!rightSideBarOpen)}
            >
                <ChatIcon/>
            </IconButton>
            </Grid>
        </Grid>
    ;


    if (isFetching || viewMode === null) {
        return viewMode === "stats" || props.statsView ? <StatsSkeleton/> : <TasksGridSkeleton count={4}/>

    } else if (viewMode === "stats" || props.statsView) {
        return (
                <PersistentDrawerRight open={rightSideBarOpen} handleDrawerClose={() => setRightSideBarOpen(false)}>
                {modeToggle}
                <TasksStatistics tasks={tasks} sessionUUID={session_uuid}/>
                </PersistentDrawerRight>
        )


    } else if (viewMode === "kanban" || mobileView) {
        return (
                <PersistentDrawerRight open={rightSideBarOpen} handleDrawerClose={() => setRightSideBarOpen(false)}>
                {modeToggle}
                <TasksGrid tasks={tasks}
                           fullScreenModal={mobileView}
                           onAddTaskClick={(task) => {
                               dispatch(addTask(task));
                           }}
                           sessionUUID={session_uuid}
                           modalView={"edit"}
                />
                </PersistentDrawerRight>

        )
    } else if (viewMode === "table") {
        return (
                <PersistentDrawerRight open={rightSideBarOpen} handleDrawerClose={() => setRightSideBarOpen(false)}>
                {modeToggle}
                <TasksTable tasks={tasks}
                            fullScreenModal={mobileView}
                            onAddTaskClick={(task) => {
                                dispatch(addTask(task));
                            }}
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
