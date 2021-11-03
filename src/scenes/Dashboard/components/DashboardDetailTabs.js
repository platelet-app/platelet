import React, { useState } from "react";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
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
import { Button, Divider, Fab, Hidden } from "@mui/material";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import CallIcon from "@mui/icons-material/Call";
import { useTheme, useMediaQuery } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ExploreIcon from "@mui/icons-material/Explore";
import {
    dataStoreReadyStatusSelector,
    getWhoami,
} from "../../../redux/Selectors";
import { userRoles } from "../../../apiConsts";
import { clearDashboardFilter } from "../../../redux/dashboardFilter/DashboardFilterActions";
import { addTask } from "../utilities";

export function TabPanel(props) {
    const { children, index, ...other } = props;
    const value = parseInt(props.value);

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={1}>{children}</Box>}
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
    return {
        appBar: {
            width: "100%",
            background: theme.palette.background.paper,
        },
    };
});

export function DashboardDetailTabs(props) {
    const dispatch = useDispatch();
    const [rightSideBarOpen, setRightSideBarOpen] = useState(false);
    const [anchorElRoleMenu, setAnchorElRoleMenu] = React.useState(null);
    const whoami = useSelector(getWhoami);
    const dashboardFilter = useSelector((state) => state.dashboardFilter);
    const roleView = useSelector((state) => state.roleView);
    const classes = useStyles();
    const { show, hide } = showHide();

    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));

    const handleChange = (event, newValue) => {
        props.onChange(event, newValue);
    };
    const tabs = isXs ? (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
                value={parseInt(props.value)}
                onChange={handleChange}
                aria-label={"dashboard-tabs"}
            >
                <Tab icon={<ExploreIcon />} {...a11yProps(0)} />
                <Tab icon={<DoneIcon />} {...a11yProps(1)} />
            </Tabs>
        </Box>
    ) : (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
                value={parseInt(props.value)}
                onChange={handleChange}
                aria-label={"dashboard-tabs"}
            >
                <Tab label="In Progress" {...a11yProps(0)} />
                <Tab label="Completed" {...a11yProps(1)} />
            </Tabs>
        </Box>
    );

    const addClearButton = !dashboardFilter ? (
        <Button
            variant="contained"
            color="primary"
            disabled={!dataStoreReadyStatus}
            onClick={() => addTask(whoami ? whoami.id : null)}
        >
            Create New
        </Button>
    ) : (
        <Button
            variant="contained"
            color="primary"
            disabled={props.disableAddButton}
            onClick={() => dispatch(clearDashboardFilter())}
        >
            Clear Search
        </Button>
    );
    return (
        <React.Fragment>
            <Toolbar className={classes.appBar} variant="dense">
                <Grid
                    container
                    spacing={1}
                    wrap={"nowrap"}
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Grid item>
                        <Grid
                            container
                            spacing={2}
                            direction={"row"}
                            justifyContent={"flex-start"}
                            alignItems={"center"}
                        >
                            <Grid item>
                                <Box sx={{ width: "100%" }}>{tabs}</Box>
                            </Grid>
                            <Hidden mdDown>
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
                            justifyContent={"flex-start"}
                            alignItems={"center"}
                        >
                            <Grid item>
                                <Grid
                                    className={
                                        whoami.roles.includes(
                                            userRoles.rider
                                        ) &&
                                        !whoami.roles.includes(
                                            userRoles.coordinator
                                        )
                                            ? hide
                                            : show
                                    }
                                    container
                                    direction={"row"}
                                    justifyContent={"flex-start"}
                                    alignItems={"center"}
                                >
                                    <Grid item>
                                        <Hidden mdDown>
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
                                            size="large"
                                        >
                                            <ArrowDropDownIcon />
                                        </IconButton>
                                        <Hidden smDown>{addClearButton}</Hidden>
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
                                                        userRoles.coordinator
                                                    )
                                                        ? show
                                                        : hide
                                                }
                                                onClick={() => {
                                                    setAnchorElRoleMenu(null);
                                                    if (roleView !== "all") {
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
                                                        userRoles.coordinator
                                                    )
                                                        ? show
                                                        : hide
                                                }
                                                onClick={() => {
                                                    setAnchorElRoleMenu(null);
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
                                                        userRoles.rider
                                                    )
                                                        ? show
                                                        : hide
                                                }
                                                onClick={() => {
                                                    setAnchorElRoleMenu(null);
                                                    if (roleView !== "rider") {
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
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
            <SideInfoSection
                open={rightSideBarOpen}
                handleDrawerToggle={() =>
                    setRightSideBarOpen(!rightSideBarOpen)
                }
                handleDrawerClose={() => setRightSideBarOpen(false)}
            >
                <Divider />
                {props.children}
            </SideInfoSection>
        </React.Fragment>
    );
}
