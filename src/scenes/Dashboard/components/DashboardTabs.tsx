import { Chip, Stack, Badge } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import useTaskObserveQueryByStatus from "../../../hooks/useTaskObserveQueryByStatus";
import { setDashboardTabIndex } from "../../../redux/Actions";
import {
    dashboardTabIndexSelector,
    getRoleView,
} from "../../../redux/Selectors";
import * as models from "../../../models";
import { useTheme, useMediaQuery } from "@mui/material";

const DashboardTabs = () => {
    const theme = useTheme();
    const roleView = useSelector(getRoleView);
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    const pendingTasks = useTaskObserveQueryByStatus(models.TaskStatus.PENDING);
    const pendingLength = pendingTasks?.state?.length || 0;
    const dispatch = useDispatch();

    const handleChange = (newValue: number) => {
        dispatch(setDashboardTabIndex(newValue));
    };
    return (
        <Stack
            spacing={isSm ? 0.5 : 1}
            sx={{ paddingBottom: 0.5 }}
            direction="row"
        >
            <Chip
                key="dashboard-tab-0"
                data-testid="dashboard-tab-inprogress"
                aria-label="Dashboard in Progress"
                label="IN PROGRESS"
                color={dashboardTabIndex === 0 ? "primary" : "default"}
                onClick={() => handleChange(0)}
            />
            <Chip
                key="dashboard-tab-1"
                data-testid="dashboard-tab-completed"
                aria-label="Dashboard Completed"
                onClick={() => handleChange(1)}
                color={dashboardTabIndex === 1 ? "primary" : "default"}
                label="COMPLETED"
            />
            {roleView !== "RIDER" && (
                <Badge
                    invisible={pendingLength === 0}
                    badgeContent={pendingLength}
                    color="error"
                >
                    <Chip
                        key="dashboard-tab-2"
                        data-testid="dashboard-tab-pending"
                        aria-label="Dashboard Pending"
                        onClick={() => handleChange(2)}
                        color={dashboardTabIndex === 2 ? "primary" : "default"}
                        label="UPCOMING"
                    />
                </Badge>
            )}
        </Stack>
    );
};

export default DashboardTabs;
