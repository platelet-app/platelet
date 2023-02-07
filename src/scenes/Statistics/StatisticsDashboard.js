import React, { useEffect, useState } from "react";
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
import DaysSelection from "../../components/DaysSelection";
import CoordinatorPicker from "../../components/CoordinatorPicker";
import UserChip from "../../components/UserChip";

const initialState = {
    common: {
        numCompleted: 0,
        numPickedUp: 0,
        numActive: 0,
        numUnassigned: 0,
        numRejected: 0,
        numCancelled: 0,
        numTasks: 0,
        timeActive: 0,
    },
    priorities: {
        high: 0,
        medium: 0,
        low: 0,
    },
    riders: {},
};

function StatisticsDashboard() {
    const [state, setState] = useState(initialState);
    const [isFetching, setIsFetching] = useState(false);
    const [adminSelectedUser, setAdminSelectedUser] = useState(null);
    const whoami = useSelector(getWhoami);
    const [days, setDays] = useState(3);
    const dispatch = useDispatch();

    const handleDaysChange = (value) => {
        setDays(value);
    };

    const getStatsData = React.useCallback(async () => {
        try {
            setIsFetching(true);
            const newMoment = moment();
            const start = newMoment.toISOString();
            const end = newMoment.subtract(days, "day").toISOString();
            const range = {
                start,
                end,
            };
            setState(
                await getStats(
                    models.Role.COORDINATOR,
                    range,
                    adminSelectedUser ? adminSelectedUser.id : whoami.id
                )
            );
            setIsFetching(false);
        } catch (e) {
            dispatch(displayErrorNotification("Sorry, something went wrong"));
            setState(initialState);
            console.log(e);
        }
    }, [days, whoami.id, dispatch, adminSelectedUser]);

    useEffect(() => getStatsData(), [getStatsData]);
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
                    <DaysSelection value={days} onChange={handleDaysChange} />
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
            <TasksStatistics data={state} />
        </PaddedPaper>
    );
}

export default StatisticsDashboard;
