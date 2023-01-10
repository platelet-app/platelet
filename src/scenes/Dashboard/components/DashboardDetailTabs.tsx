import React from "react";
import * as selectionModeActions from "../../../redux/selectionMode/selectionModeActions";
import AddIcon from "@mui/icons-material/Add";
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
    setGuidedSetupOpen,
    setRoleView,
} from "../../../redux/Actions";
import TaskFilterTextField from "../../../components/TaskFilterTextfield";
import { Chip, Fab, Hidden, Stack } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import {
    dashboardFilteredUserSelector,
    dashboardFilterTermSelector,
    dashboardTabIndexSelector,
    getRoleView,
    getWhoami,
    guidedSetupOpenSelector,
} from "../../../redux/Selectors";
import { clearDashboardFilter } from "../../../redux/dashboardFilter/DashboardFilterActions";
import * as models from "../../../models";

type DashboardDetailTabsProps = {
    disableAddButton?: boolean;
};

const DashboardDetailTabs: React.FC<DashboardDetailTabsProps> = ({
    disableAddButton,
}) => {
    const dispatch = useDispatch();
    const [anchorElRoleMenu, setAnchorElRoleMenu] = React.useState<
        (EventTarget & HTMLSpanElement) | null
    >(null);
    const whoami = useSelector(getWhoami);
    const dashboardFilter = useSelector(dashboardFilterTermSelector);
    const roleView = useSelector(getRoleView);
    const { show, hide } = showHide();
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const guidedSetupOpen = useSelector(guidedSetupOpenSelector);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const isMd = useMediaQuery(theme.breakpoints.down("md"));
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);
    const isCoordinator =
        whoami && whoami.roles.includes(models.Role.COORDINATOR);
    let roleViewText = "";
    if (roleView) {
        if (isMd) {
            roleViewText = `${roleView.substring(0, 5).toUpperCase()}`;
        } else {
            roleViewText = roleView.toUpperCase();
        }
    }

    const handleChange = (newValue: number) => {
        dispatch(setDashboardTabIndex(newValue));
    };

    const tabs = (
        <Stack sx={{ padding: 0.5 }} spacing={isSm ? 1 : 2} direction="row">
            <Chip
                key="dashboard-tab-0"
                aria-label="Dashboard in Progress"
                sx={{ padding: 1 }}
                label="IN PROGRESS"
                color={dashboardTabIndex === 0 ? "primary" : "default"}
                onClick={() => handleChange(0)}
            />
            <Chip
                key="dashboard-tab-1"
                aria-label="Dashboard Completed"
                sx={{ padding: 1 }}
                onClick={() => handleChange(1)}
                color={dashboardTabIndex === 1 ? "primary" : "default"}
                label="COMPLETED"
            />
        </Stack>
    );
    const clearAllSelectedItems = () => {
        dispatch(selectionModeActions.clearItems(0));
        dispatch(selectionModeActions.clearItems(1));
    };
    const addClearButton =
        !dashboardFilter && !dashboardFilteredUser ? (
            <Fab
                color="primary"
                aria-label="Create New"
                variant="extended"
                data-cy="create-task-button"
                disabled={
                    guidedSetupOpen ||
                    (roleView && roleView === models.Role.RIDER)
                }
                onClick={() => dispatch(setGuidedSetupOpen(true))}
            >
                <AddIcon sx={{ mr: 1 }} />
                Create New
            </Fab>
        ) : (
            <Fab
                variant="extended"
                aria-label="Clear Search"
                color="secondary"
                data-cy="clear-search-button"
                disabled={disableAddButton}
                onClick={() => {
                    dispatch(clearDashboardFilter());
                    dispatch(setDashboardFilteredUser(null));
                }}
            >
                Clear Search
            </Fab>
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
            <Box>{tabs}</Box>
            <Hidden mdDown>
                <TaskFilterTextField sx={{ width: "40%" }} />
            </Hidden>
            <Stack
                spacing={1}
                direction={"row"}
                justifyContent={"flex-start"}
                alignItems={"center"}
            >
                {isCoordinator && (
                    <>
                        <Typography
                            onClick={(event) => {
                                setAnchorElRoleMenu(event.currentTarget);
                            }}
                            sx={{ cursor: "pointer" }}
                            data-cy="role-identifier"
                        >
                            {roleViewText}
                        </Typography>
                        <IconButton
                            data-cy="role-menu-button"
                            aria-label="Role Selection Menu"
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={(event) => {
                                setAnchorElRoleMenu(event.currentTarget);
                            }}
                            size="large"
                        >
                            <ArrowDropDownIcon />
                        </IconButton>
                    </>
                )}

                <Hidden smDown>
                    {["ALL", models.Role.COORDINATOR].includes(roleView) &&
                        addClearButton}
                </Hidden>
                <Menu
                    data-cy="role-menu"
                    anchorEl={anchorElRoleMenu}
                    keepMounted
                    open={Boolean(anchorElRoleMenu)}
                    onClose={() => {
                        setAnchorElRoleMenu(null);
                    }}
                >
                    <MenuItem
                        className={
                            whoami.roles.includes(models.Role.COORDINATOR)
                                ? show
                                : hide
                        }
                        onClick={() => {
                            setAnchorElRoleMenu(null);
                            if (roleView !== "ALL") {
                                dispatch(setRoleView("ALL"));
                                saveDashboardRoleMode("ALL");
                                clearAllSelectedItems();
                            }
                        }}
                    >
                        All Tasks
                    </MenuItem>
                    <MenuItem
                        className={
                            whoami.roles.includes(models.Role.COORDINATOR)
                                ? show
                                : hide
                        }
                        onClick={() => {
                            setAnchorElRoleMenu(null);
                            if (roleView !== models.Role.COORDINATOR) {
                                dispatch(setRoleView(models.Role.COORDINATOR));
                                saveDashboardRoleMode(models.Role.COORDINATOR);
                                clearAllSelectedItems();
                            }
                        }}
                    >
                        Coordinator
                    </MenuItem>
                    <MenuItem
                        className={
                            whoami.roles.includes(models.Role.RIDER)
                                ? show
                                : hide
                        }
                        onClick={() => {
                            setAnchorElRoleMenu(null);
                            if (roleView !== models.Role.RIDER) {
                                dispatch(setRoleView(models.Role.RIDER));
                                dispatch(setDashboardFilteredUser(null));
                                saveDashboardRoleMode(models.Role.RIDER);
                                clearAllSelectedItems();
                            }
                        }}
                    >
                        Rider
                    </MenuItem>
                </Menu>
            </Stack>
        </Stack>
    );
};

export default DashboardDetailTabs;
