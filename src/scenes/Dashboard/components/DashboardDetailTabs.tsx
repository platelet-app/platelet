import React from "react";
import RoleViewSelect from "./RoleViewSelect";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import {
    setDashboardFilteredUser,
    setGuidedSetupOpen,
} from "../../../redux/Actions";
import TaskFilterTextField from "../../../components/TaskFilterTextfield";
import { Fab, Hidden, Stack } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import {
    dashboardFilteredUserSelector,
    dashboardFilterTermSelector,
    dashboardTabIndexSelector,
    getRoleView,
    guidedSetupOpenSelector,
} from "../../../redux/Selectors";
import { clearDashboardFilter } from "../../../redux/dashboardFilter/DashboardFilterActions";
import * as models from "../../../models";
import DashboardTabs from "./DashboardTabs";

type DashboardDetailTabsProps = {
    disableAddButton?: boolean;
};

const DashboardDetailTabs: React.FC<DashboardDetailTabsProps> = ({
    disableAddButton,
}) => {
    const dispatch = useDispatch();
    const dashboardFilter = useSelector(dashboardFilterTermSelector);
    const roleView = useSelector(getRoleView);
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const guidedSetupOpen = useSelector(guidedSetupOpenSelector);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);

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
                Create
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
            <Box>
                <DashboardTabs />
            </Box>
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
                {!isSm && dashboardTabIndex !== 2 && <RoleViewSelect />}
            </Stack>
        </Stack>
    );
};

export default DashboardDetailTabs;
