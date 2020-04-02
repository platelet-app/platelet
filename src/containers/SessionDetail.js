import React, {useEffect, useState} from 'react';
import '../App.css';
import 'typeface-roboto'
import Grid from "@material-ui/core/Grid";
import {
    addTask,
    getAllTasks,
} from '../redux/tasks/Actions'
import {setMenuIndex, setViewMode} from "../redux/Actions";
import {getSession} from "../redux/sessions/Actions";
import {makeStyles} from "@material-ui/core/styles";
import TasksGrid from "../components/TasksGrid";
import {decodeUUID} from "../utilities";
import {useDispatch, useSelector} from "react-redux"
import {
    Link,
    useLocation,
} from "react-router-dom";
import {createLoadingSelector} from '../redux/selectors';
import TasksGridSkeleton from "../loadingComponents/TasksGridSkeleton";
import TasksTable from "../components/TasksTable";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Menu from "@material-ui/core/Menu";
import {Typography} from "@material-ui/core";
import CardItem from "../components/CardItem";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

function GetViewTitle(props) {
    console.log(props.type)
    switch (props.type) {
        case "kanban":
            return <Typography>Kanban</Typography>
        case "table":
            return <Typography>Table</Typography>
        default:
            return <Typography></Typography>

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


    function componentDidMount() {
        dispatch(getAllTasks(session_uuid));
        dispatch(getSession(session_uuid));
    }

    useEffect(componentDidMount, []);
    useEffect(() => {dispatch(setMenuIndex(2))}, []);


    let location = useLocation();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const modeToggle = mobileView ? <></> :
        <Grid container
              spacing={1}
              direction={"row"}
              justify={"flex-start"}
              alignItems={"center"}
        >
            <Grid item>
                <GetViewTitle type={viewMode}/>
            </Grid>
            <Grid item>
            <IconButton
                color="inherit"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                }}>
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
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        dispatch(setViewMode("kanban"))
                    }}>
                        <Typography>Kanban</Typography>
                    </MenuItem>
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    dispatch(setViewMode("table"))
                }}>
                    <Typography>Table</Typography>
                </MenuItem>
            </Menu>
            </Grid>
            </Grid>
    ;

    if (isFetching) {
        return <TasksGridSkeleton count={4}/>
    } else if (viewMode === "kanban" || mobileView) {
        return (
            <>
                {modeToggle}
                <TasksGrid tasks={tasks}
                           location={location}
                           fullScreenModal={mobileView}
                           onAddTaskClick={(task) => {
                               dispatch(addTask(task));
                           }}
                           sessionUUID={session_uuid}
                           modalView={"edit"}
                />
            </>

        )
    } else if (viewMode == "table") {
        return (
            <>
                {modeToggle}
                <TasksTable tasks={tasks}
                            location={location}
                            fullScreenModal={mobileView}
                            onAddTaskClick={(task) => {
                                dispatch(addTask(task));
                            }}
                            sessionUUID={session_uuid}
                            modalView={"edit"}
                />
            </>

        )

    }
}

export default SessionDetail;
