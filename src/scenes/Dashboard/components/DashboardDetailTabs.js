import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {useDispatch, useSelector} from "react-redux";
import {createPostingSelector} from "../../../redux/selectors";
import {clearTaskContextMenuSnack} from "../../../redux/Actions";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import ChatIcon from "@material-ui/icons/Chat";
import Grid from "@material-ui/core/Grid";
import PersistentDrawerRight from "./SideInfoSection";
import CollaboratorsSection from "./CollaboratorsSection";
import Toolbar from "@material-ui/core/Toolbar";

export function TabPanel(props) {
    const {children, index, ...other} = props;
    const value = parseInt(props.value)

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: "rgb(240, 240, 240)",
        maxWidth: "1850px",
    },
}));

export function DashboardDetailTabs(props) {
    const dispatch = useDispatch();
    const [rightSideBarOpen, setRightSideBarOpen] = useState(false);
    const snack = useSelector(state => state.taskContextMenuSnack);
    const currentSession = useSelector(state => state.session.session);
    const whoami = useSelector(state => state.whoami.user);
    const postingSelector = createPostingSelector([
        "DELETE_TASK",
        "RESTORE_TASK",
        "UPDATE_TASK",
        "UPDATE_TASK_PICKUP_TIME",
        "UPDATE_TASK_DROPOFF_TIME",
        "UPDATE_TASK_CANCELLED_TIME",
        "UPDATE_TASK_REJECTED_TIME"]);
    const isPosting = useSelector(state => postingSelector(state));

    function dispatchSnack() {
        if (!isPosting && snack !== undefined) {
            snack.snack();
            dispatch(clearTaskContextMenuSnack())
        }
    }

    useEffect(dispatchSnack, [isPosting])

    const handleChange = (event, newValue) => {
        props.onChange(event, newValue);
    };


    return (
        <>
                <AppBar position="static">
                    <Toolbar variant="dense">
                    <Grid container spacing={1} wrap={"nowrap"} direction={"row"} justify={"space-between"} alignItems={"center"}>
                        <Grid item>
                            <Tabs value={parseInt(props.value)} onChange={handleChange}
                                  aria-label={"dashboard-tabs"}>
                                <Tab label="Active" {...a11yProps(0)} />
                                <Tab label="Completed" {...a11yProps(1)} />
                            </Tabs>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={2} direction={"row"} justify={"flex-start"} alignItems={"center"}>
                                <Grid item>
                                    <CollaboratorsSection
                                        allowAdd={(whoami.uuid === currentSession.coordinator_uuid || whoami.roles.includes("admin"))}
                                        collaborators={currentSession.collaborators}
                                        sessionUUID={currentSession.uuid}
                                        coordinatorUUID={currentSession.coordinator_uuid}
                                    />
                                </Grid>
                                <Grid item>

                                    <Tooltip title="View Log">
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
                        </Grid>
                    </Grid>
                    </Toolbar>
                </AppBar>
    <PersistentDrawerRight open={rightSideBarOpen}
                           handleDrawerToggle={() => setRightSideBarOpen(!rightSideBarOpen)}
                           handleDrawerClose={() => setRightSideBarOpen(false)}>
        {props.children}
    </PersistentDrawerRight>
        </>
    );
}
