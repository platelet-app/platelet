import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { createPostingSelector } from "../../../redux/LoadingSelectors";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import TimelineIcon from "@mui/icons-material/Timeline";
import Grid from "@mui/material/Grid";
import SideInfoSection from "./SideInfoSection";
import Toolbar from "@mui/material/Toolbar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { saveDashboardRoleMode } from "../../../utilities";
import Typography from "@mui/material/Typography";
import { showHide } from "../../../styles/common";
import { setRoleViewAndGetTasks } from "../../../redux/tasks/TasksActions";
import TaskFilterTextField from "../../../components/TaskFilterTextfield";
import { Hidden } from "@mui/material";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import CallIcon from "@mui/icons-material/Call";
import { useTheme, useMediaQuery } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ExploreIcon from "@mui/icons-material/Explore";
import { getWhoami } from "../../../redux/Selectors";

export function TabPanel(props) {
    const { children, index, ...other } = props;
    const value = parseInt(props.value);
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={isMd ? 1 : 3}>{children}</Box>}
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
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => {
    const appBarBack =
        theme.palette.type === "dark"
            ? theme.palette.background.paper
            : theme.palette.primary.main;
    return {
        appBar: {
            width: "100%",
            background: appBarBack,
        },
    };
});

export function DashboardDetailTabs(props) {
    const dispatch = useDispatch();
    const [rightSideBarOpen, setRightSideBarOpen] = useState(false);
    const [anchorElRoleMenu, setAnchorElRoleMenu] = React.useState(null);
    const whoami = useSelector(getWhoami);
    const roleView = useSelector((state) => state.roleView);
    const classes = useStyles();
    const { show, hide } = showHide();
    const postingSelector = createPostingSelector([
        "DELETE_TASK",
        "RESTORE_TASK",
        "UPDATE_TASK",
        "UPDATE_TASK_PICKUP_TIME",
        "UPDATE_TASK_DROPOFF_TIME",
        "UPDATE_TASK_CANCELLED_TIME",
        "UPDATE_TASK_REJECTED_TIME",
    ]);
    const isPosting = useSelector((state) => postingSelector(state));

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));

    const handleChange = (event, newValue) => {
        props.onChange(event, newValue);
    };
    const tabs = isXs ? (
        <Tabs
            value={parseInt(props.value)}
            onChange={handleChange}
            aria-label={"dashboard-tabs"}
        >
            <Tab icon={<ExploreIcon />} {...a11yProps(0)} />
            <Tab icon={<DoneIcon />} {...a11yProps(1)} />
        </Tabs>
    ) : (
        <Tabs
            value={parseInt(props.value)}
            onChange={handleChange}
            aria-label={"dashboard-tabs"}
        >
            <Tab label="Active" {...a11yProps(0)} />
            <Tab label="Completed" {...a11yProps(1)} />
        </Tabs>
    );

    return (
        <React.Fragment>
            <AppBar className={classes.appBar} position="static">
                <Toolbar variant="dense">
                    <Grid
                        container
                        spacing={1}
                        wrap={"nowrap"}
                        direction={"row"}
                        justify={"space-between"}
                        alignItems={"center"}
                    >
                        <Grid item>
                            <Grid
                                container
                                spacing={2}
                                direction={"row"}
                                justify={"flex-start"}
                                alignItems={"center"}
                            >
                                <Grid item>{tabs}</Grid>
                                <Hidden smDown>
                                    <Grid item>
                                        <TaskFilterTextField />
                                    </Grid>
                                </Hidden>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid
                                container
                                spacing={2}
                                direction={"row"}
                                justify={"flex-start"}
                                alignItems={"center"}
                            >
                                <Grid item>
                                    <Grid
                                        className={
                                            whoami.roles.includes("RIDER") &&
                                            !whoami.roles.includes(
                                                "COORDINATOR"
                                            )
                                                ? hide
                                                : show
                                        }
                                        container
                                        direction={"row"}
                                        justify={"flex-start"}
                                        alignItems={"center"}
                                    >
                                        <Grid item>
                                            <Hidden smDown>
                                                <Typography>
                                                    {`${roleView} view`.toUpperCase()}
                                                </Typography>
                                            </Hidden>
                                            <Hidden mdUp>
                                                {roleView === "rider" ? (
                                                    <TwoWheelerIcon />
                                                ) : (
                                                    <CallIcon />
                                                )}
                                            </Hidden>
                                        </Grid>
                                        <Grid item>
                                            <IconButton
                                                color="inherit"
                                                aria-controls="simple-menu"
                                                aria-haspopup="true"
                                                onClick={(event) => {
                                                    setAnchorElRoleMenu(
                                                        event.currentTarget
                                                    );
                                                }}
                                            >
                                                <ArrowDropDownIcon />
                                            </IconButton>
                                            <Menu
                                                id="profile-menu"
                                                anchorEl={anchorElRoleMenu}
                                                keepMounted
                                                open={Boolean(anchorElRoleMenu)}
                                                onClose={() => {
                                                    setAnchorElRoleMenu(null);
                                                }}
                                            >
                                                <MenuItem
                                                    className={
                                                        whoami.roles.includes(
                                                            "COORDINATOR"
                                                        )
                                                            ? show
                                                            : hide
                                                    }
                                                    onClick={() => {
                                                        setAnchorElRoleMenu(
                                                            null
                                                        );
                                                        if (
                                                            roleView !== "all"
                                                        ) {
                                                            dispatch(
                                                                setRoleViewAndGetTasks(
                                                                    whoami.id,
                                                                    "",
                                                                    "all"
                                                                )
                                                            );
                                                            saveDashboardRoleMode(
                                                                "all"
                                                            );
                                                        }
                                                    }}
                                                >
                                                    All Tasks
                                                </MenuItem>
                                                <MenuItem
                                                    className={
                                                        whoami.roles.includes(
                                                            "COORDINATOR"
                                                        )
                                                            ? show
                                                            : hide
                                                    }
                                                    onClick={() => {
                                                        setAnchorElRoleMenu(
                                                            null
                                                        );
                                                        if (
                                                            roleView !==
                                                            "coordinator"
                                                        ) {
                                                            dispatch(
                                                                setRoleViewAndGetTasks(
                                                                    whoami.id,
                                                                    "",
                                                                    "coordinator"
                                                                )
                                                            );
                                                            saveDashboardRoleMode(
                                                                "coordinator"
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Coordinator
                                                </MenuItem>
                                                <MenuItem
                                                    className={
                                                        whoami.roles.includes(
                                                            "RIDER"
                                                        )
                                                            ? show
                                                            : hide
                                                    }
                                                    onClick={() => {
                                                        setAnchorElRoleMenu(
                                                            null
                                                        );
                                                        if (
                                                            roleView !== "rider"
                                                        ) {
                                                            dispatch(
                                                                setRoleViewAndGetTasks(
                                                                    whoami.id,
                                                                    "",
                                                                    "rider"
                                                                )
                                                            );
                                                            saveDashboardRoleMode(
                                                                "rider"
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Rider
                                                </MenuItem>
                                            </Menu>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Tooltip title="Recent Activity">
                                        <IconButton
                                            color="inherit"
                                            aria-label="open drawer"
                                            onClick={() =>
                                                setRightSideBarOpen(
                                                    !rightSideBarOpen
                                                )
                                            }
                                        >
                                            <TimelineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <SideInfoSection
                open={rightSideBarOpen}
                handleDrawerToggle={() =>
                    setRightSideBarOpen(!rightSideBarOpen)
                }
                handleDrawerClose={() => setRightSideBarOpen(false)}
            >
                {props.children}
            </SideInfoSection>
        </React.Fragment>
    );
}
