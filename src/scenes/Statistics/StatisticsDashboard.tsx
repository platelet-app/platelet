import React, { useState } from "react";
import * as models from "../../models";
import { PaddedPaper } from "../../styles/common";
import TasksStatistics from "./components/TasksStatistics";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { Fade, Stack, Box, Divider } from "@mui/material";
import { getWhoami } from "../../redux/Selectors";
import getStats from "./utilities/getStats";
import moment from "moment";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import DaysSelection, { Days } from "../../components/DaysSelection";
import CoordinatorPicker from "../../components/CoordinatorPicker";
import UserChip from "../../components/UserChip";
import useGetTasksGraphql from "../../hooks/useGetTasksGraphql";
import { ModelSortDirection } from "../../API";

function StatisticsDashboard() {
    const [adminSelectedUser, setAdminSelectedUser] =
        useState<models.User | null>(null);
    const whoami = useSelector(getWhoami);
    const [days, setDays] = useState(3);
    const [startDate, setStartDate] = useState(
        moment().subtract(3, "day").toDate()
    );
    const [endDate, setEndDate] = useState(moment().toDate());
    const { state, isFetching, isFetchingMore, isFinished, getNext, error } =
        useGetTasksGraphql(
            100,
            ModelSortDirection.DESC,
            startDate,
            endDate,
            true
        );
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (error) {
            dispatch(displayErrorNotification("Sorry, something went wrong."));
        }
    }, [error, dispatch]);

    const getMore = React.useCallback(async () => {
        if (!isFinished && !isFetchingMore && !isFetching) {
            console.log("Fetching more tasks...");
            await getNext();
        }
    }, [isFinished, getNext, isFetchingMore, isFetching]);

    React.useEffect(() => {
        getMore();
    }, [getMore]);

    const handleDaysChange = (value: number) => {
        setDays(value);
        setStartDate(moment().subtract(value, "day").toDate());
        setEndDate(moment().toDate());
    };

    const isAdmin = whoami?.roles?.includes(models.Role.ADMIN);

    return (
        <PaddedPaper>
            <Stack
                sx={{ paddingBottom: 3 }}
                divider={<Divider />}
                direction="column"
                spacing={2}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <DaysSelection
                        exclude={[Days.TWO_WEEKS]}
                        value={days}
                        onChange={handleDaysChange}
                        disabled={isFetching || isFetchingMore}
                    />
                    <Fade
                        in={isFetching}
                        style={{
                            transitionDelay: isFetching ? "800ms" : "0ms",
                        }}
                    >
                        <CircularProgress />
                    </Fade>
                </Stack>
                {isAdmin && !adminSelectedUser && (
                    <Box sx={{ maxWidth: 400 }}>
                        <CoordinatorPicker
                            label="Select a coordinator..."
                            onSelect={(v) => setAdminSelectedUser(v)}
                        />
                    </Box>
                )}
                {adminSelectedUser && (
                    <Box>
                        <UserChip
                            user={adminSelectedUser}
                            onDelete={() => setAdminSelectedUser(null)}
                        />
                    </Box>
                )}
            </Stack>
            <TasksStatistics
                data={getStats(state, adminSelectedUser?.id || whoami.id)}
            />
        </PaddedPaper>
    );
}

export default StatisticsDashboard;
