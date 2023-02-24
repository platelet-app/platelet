import React from "react";
import * as selectionModeActions from "../../../redux/selectionMode/selectionModeActions";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import { saveDashboardRoleMode } from "../../../utilities";
import {
    setDashboardFilteredUser,
    setDashboardTabIndex,
    setGuidedSetupOpen,
    setRoleView,
} from "../../../redux/Actions";
import TaskFilterTextField from "../../../components/TaskFilterTextfield";
import { Chip, Fab, FormControl, Hidden, Select, Stack } from "@mui/material";
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
    const whoami = useSelector(getWhoami);
    const dashboardFilter = useSelector(dashboardFilterTermSelector);
    const roleView = useSelector(getRoleView);
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const guidedSetupOpen = useSelector(guidedSetupOpenSelector);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const isMd = useMediaQuery(theme.breakpoints.down("md"));
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);

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
                direction={"row-reverse"}
                justifyContent={"flex-start"}
                alignItems={"center"}
            >
                <Hidden smDown>
                    {["ALL", models.Role.COORDINATOR].includes(roleView) &&
                        addClearButton}
                </Hidden>
                <FormControl variant="outlined">
                    <Select
                        sx={{
                            right: 5,
                            borderRadius: 2,
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "orange",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "orange",
                            },
                        }}
                        disabled={guidedSetupOpen}
                        size="small"
                        data-cy="role-menu"
                        value={roleView}
                    >
                        {whoami.roles.includes(models.Role.COORDINATOR) && (
                            <MenuItem
                                value="ALL"
                                onClick={() => {
                                    if (roleView !== "ALL") {
                                        dispatch(setRoleView("ALL"));
                                        saveDashboardRoleMode("ALL");
                                        clearAllSelectedItems();
                                    }
                                }}
                            >
                                ALL
                            </MenuItem>
                        )}
                        {whoami.roles.includes(models.Role.COORDINATOR) && (
                            <MenuItem
                                value={models.Role.COORDINATOR}
                                onClick={() => {
                                    if (roleView !== models.Role.COORDINATOR) {
                                        dispatch(
                                            setRoleView(models.Role.COORDINATOR)
                                        );
                                        saveDashboardRoleMode(
                                            models.Role.COORDINATOR
                                        );
                                        clearAllSelectedItems();
                                    }
                                }}
                            >
                                {isMd ? "COORD" : "COORDINATOR"}
                            </MenuItem>
                        )}
                        {whoami.roles.includes(models.Role.RIDER) && (
                            <MenuItem
                                value={models.Role.RIDER}
                                onClick={() => {
                                    if (roleView !== models.Role.RIDER) {
                                        dispatch(
                                            setRoleView(models.Role.RIDER)
                                        );
                                        dispatch(
                                            setDashboardFilteredUser(null)
                                        );
                                        saveDashboardRoleMode(
                                            models.Role.RIDER
                                        );
                                        clearAllSelectedItems();
                                    }
                                }}
                            >
                                RIDER
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Stack>
        </Stack>
    );
};

export default DashboardDetailTabs;
