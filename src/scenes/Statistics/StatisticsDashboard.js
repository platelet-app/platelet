import React, { useEffect, useState } from "react";
import * as models from "../../models";
import { PaddedPaper } from "../../styles/common";
import TasksStatistics from "./components/TasksStatistics";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";
import { Fade, Stack } from "@mui/material";
import { getWhoami } from "../../redux/Selectors";
import getStats from "./utilities/getStats";
import moment from "moment";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import DaysSelection from "../../components/DaysSelection";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

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
            setState(await getStats(models.Role.COORDINATOR, range, whoami.id));
            setIsFetching(false);
        } catch (e) {
            dispatch(displayErrorNotification("Sorry, something went wrong"));
            setState(initialState);
            console.log(e);
        }
    }, [days, whoami.id, dispatch]);

    useEffect(() => getStatsData(), [getStatsData]);

    return (
        <PaddedPaper>
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
            >
                <DaysSelection value={days} onChange={handleDaysChange} />
                <Fade
                    in={isFetching}
                    style={{
                        transitionDelay: isFetching ? "800ms" : "0ms",
                    }}
                    unmountOnExit
                >
                    <CircularProgress />
                </Fade>
            </Stack>
            <TasksStatistics data={state} />
        </PaddedPaper>
    );
}

export default StatisticsDashboard;
