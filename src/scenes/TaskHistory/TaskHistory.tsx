import React from "react";
import { Skeleton, Stack, Typography } from "@mui/material";
import { useInView } from "react-intersection-observer";
import useGetTasksGraphql from "../../hooks/useGetTasksGraphql";
import _ from "lodash";
import TaskHistoryCard from "./components/TaskHistoryCard";
import TaskHistoryControls from "./components/TaskHistoryControls";
import { ModelSortDirection } from "../../API";

const limit = 10;

const TaskHistory: React.FC = () => {
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

    const handleSetDateRange = (startDate: Date, endDate: Date) => {
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
                {state.map((task) => (
                    <TaskHistoryCard key={task.id} task={task} />
                ))}
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
