import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { saveDashboardRoleMode } from "../../../utilities";
import Typography from "@mui/material/Typography";
import { showHide } from "../../../styles/common";
import {
    setDashboardFilteredUser,
    setDashboardTabIndex,
    setRoleView,
} from "../../../redux/Actions";
import TaskFilterTextField from "../../../components/TaskFilterTextfield";
import { Button, Hidden, Stack } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ExploreIcon from "@mui/icons-material/Explore";
import {
    dashboardFilteredUserSelector,
    dashboardTabIndexSelector,
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
            id={`dashboard-tabpanel-${index}`}
            aria-labelledby={`dashboard-tab-${index}`}
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
        id: `dashboard-tab-${index}`,
        "aria-controls": `dashboard-tabpanel-${index}`,
    };
}

export function DashboardDetailTabs(props) {
    const dispatch = useDispatch();
    const [anchorElRoleMenu, setAnchorElRoleMenu] = React.useState(null);
    const whoami = useSelector(getWhoami);
    const dashboardFilter = useSelector((state) => state.dashboardFilter);
    const roleView = useSelector((state) => state.roleView);
    const { show, hide } = showHide();
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);

    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);

    const handleChange = (event, newValue) => {
        //props.onChange(event, newValue);
        dispatch(setDashboardTabIndex(newValue));
    };
    const tabs = isXs ? (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
                value={parseInt(dashboardTabIndex)}
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
                value={parseInt(dashboardTabIndex)}
                onChange={handleChange}
                aria-label={"dashboard-tabs"}
            >
                <Tab label="In Progress" {...a11yProps(0)} />
                <Tab label="Completed" {...a11yProps(1)} />
            </Tabs>
        </Box>
    );

    const addClearButton =
        !dashboardFilter && !dashboardFilteredUser ? (
            <Button
                variant="contained"
                color="primary"
                id="create-task-button"
                disabled={
                    !dataStoreReadyStatus ||
                    (roleView && roleView === userRoles.rider)
                }
                onClick={() => addTask(whoami ? whoami.id : null)}
            >
                Create New
            </Button>
        ) : (
            <Button
                variant="contained"
                color="primary"
                id="clear-search-button"
                disabled={props.disableAddButton}
                onClick={() => {
                    dispatch(clearDashboardFilter());
                    dispatch(setDashboardFilteredUser(null));
                }}
            >
                Clear Search
            </Button>
        );
    return (
        <Stack
            sx={{
                width: "100%",
            }}
            spacing={2}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
        >
            <Stack
                direction={"row"}
                spacing={2}
                justifyContent={"flex-start"}
                alignItems={"flex-end"}
            >
                <Box>{tabs}</Box>
                <Hidden mdDown>
                    <TaskFilterTextField />
                </Hidden>
            </Stack>
            <Stack
                spacing={1}
                direction={"row"}
                justifyContent={"flex-start"}
                alignItems={"center"}
            >
                <Hidden mdDown>
                    <Typography id="role-identifier">
                        {`${roleView} view`.toUpperCase()}
                    </Typography>
                </Hidden>
                <Hidden mdUp>
                    <Typography id="role-identifier">
                        {`${roleView.substring(0, 5).toUpperCase()}`}
                    </Typography>
                </Hidden>
                <IconButton
                    id="role-menu-button"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={(event) => {
                        setAnchorElRoleMenu(event.currentTarget);
                    }}
                    size="large"
                >
                    <ArrowDropDownIcon />
                </IconButton>
                <Hidden smDown>
                    {["ALL", userRoles.coordinator].includes(roleView) &&
                        addClearButton}
                </Hidden>
                <Menu
                    id="role-menu"
                    anchorEl={anchorElRoleMenu}
                    keepMounted
                    open={Boolean(anchorElRoleMenu)}
                    onClose={() => {
                        setAnchorElRoleMenu(null);
                    }}
                >
                    <MenuItem
                        className={
                            whoami.roles.includes(userRoles.coordinator)
                                ? show
                                : hide
                        }
                        onClick={() => {
                            setAnchorElRoleMenu(null);
                            if (roleView !== "ALL") {
                                dispatch(setRoleView("ALL"));
                                saveDashboardRoleMode("ALL");
                            }
                        }}
                    >
                        All Tasks
                    </MenuItem>
                    <MenuItem
                        className={
                            whoami.roles.includes(userRoles.coordinator)
                                ? show
                                : hide
                        }
                        onClick={() => {
                            setAnchorElRoleMenu(null);
                            if (roleView !== userRoles.coordinator) {
                                dispatch(setRoleView(userRoles.coordinator));
                                saveDashboardRoleMode(userRoles.coordinator);
                            }
                        }}
                    >
                        Coordinator
                    </MenuItem>
                    <MenuItem
                        className={
                            whoami.roles.includes(userRoles.rider) ? show : hide
                        }
                        onClick={() => {
                            setAnchorElRoleMenu(null);
                            if (roleView !== userRoles.rider) {
                                dispatch(setRoleView(userRoles.rider));
                                dispatch(setDashboardFilteredUser(null));
                                saveDashboardRoleMode(userRoles.rider);
                            }
                        }}
                    >
                        Rider
                    </MenuItem>
                </Menu>
            </Stack>
        </Stack>
    );
}
