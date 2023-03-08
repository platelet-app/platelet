import React from "react";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useInView } from "react-intersection-observer";
import useGetTasksGraphql from "../../hooks/useGetTasksGraphql";
import _ from "lodash";
import TaskHistoryCard from "./components/TaskHistoryCard";
import TaskHistoryControls from "./components/TaskHistoryControls";
import { ModelSortDirection } from "../../API";
import DateStampDivider from "../Dashboard/components/TimeStampDivider";

const limit = 10;

const TaskHistory: React.FC = () => {
    let displayDate = false;
    let lastTime = new Date();
    const [sortDirection, setSortDirection] =
        React.useState<ModelSortDirection>(ModelSortDirection.DESC);
    const [dateRange, setDateRange] = React.useState<{
        startDate: Date | null;
        endDate: Date | null;
    }>({
        startDate: new Date("2000-01-01"),
        endDate: new Date(),
    });
    const { state, getNext, isFinished, isFetching, error } =
        useGetTasksGraphql(
            limit,
            sortDirection,
            dateRange.startDate,
            dateRange.endDate
        );
    const { ref, inView } = useInView({
        threshold: 0,
    });

    const handleSetDateRange = (
        startDate: Date | null,
        endDate: Date | null
    ) => {
        setDateRange({ startDate, endDate });
    };

    React.useEffect(() => {
        if (inView && !isFinished) {
            getNext();
        }
    }, [inView, getNext, state, isFinished]);

    return (
        <>
            <Stack spacing={1}>
                <TaskHistoryControls
                    sortDirection={sortDirection}
                    setSortDirection={(v) => setSortDirection(v)}
                    setDateRange={handleSetDateRange}
                    isFetching={isFetching}
                />
                {state.map((task) => {
                    displayDate = false;
                    let component = (
                        <TaskHistoryCard key={task.id} task={task} />
                    );
                    console.log(task.dateCreated);
                    if (task.dateCreated) {
                        const timeComparison = new Date(task.dateCreated);
                        console.log(timeComparison, lastTime);
                        if (
                            timeComparison.getDate() <=
                            lastTime.getDate() - 1
                        ) {
                            lastTime = timeComparison;
                            displayDate = true;
                        }
                        if (displayDate) {
                            component = (
                                <React.Fragment key={task.id}>
                                    <Box sx={{ maxWidth: 800 }}>
                                        <DateStampDivider
                                            date={lastTime.toISOString()}
                                        />
                                    </Box>
                                    <TaskHistoryCard task={task} />
                                </React.Fragment>
                            );
                        }
                    }
                    return component;
                })}
                {error && <Typography>Sorry, something went wrong.</Typography>}
                <div ref={ref} />
                {!isFinished &&
                    _.range(0, 4).map((i) => (
                        <Skeleton
                            sx={{
                                height: 200,
                                width: 800,
                                borderRadius: 4,
                            }}
                            key={i}
                        />
                    ))}
            </Stack>
        </>
    );
};

export default TaskHistory;
