import React from "react";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { useInView } from "react-intersection-observer";
import useGetTasksGraphql from "../../hooks/useGetTasksGraphql";
import _ from "lodash";
import TaskHistoryCard from "./components/TaskHistoryCard";
import TaskHistoryControls from "./components/TaskHistoryControls";
import { ModelSortDirection } from "../../API";
import DateStampDivider from "../Dashboard/components/TimeStampDivider";
import TaskHistoryTaskDialog from "./components/TaskHistoryTaskDialog";

const limit = 20;

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
    const [openTaskId, setOpenTaskId] = React.useState<string | null>(null);
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

    const skeletonRange = state.length ? 1 : 20;

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
                        <Box
                            onClick={() => setOpenTaskId(task.id)}
                            key={task.id}
                        >
                            <TaskHistoryCard task={task} />
                        </Box>
                    );
                    if (task.dateCreated) {
                        const timeComparison = new Date(task.dateCreated);
                        if (
                            timeComparison.getDate() <=
                            lastTime.getDate() - 1
                        ) {
                            lastTime = timeComparison;
                            displayDate = true;
                        }
                        if (displayDate) {
                            component = (
                                <Box
                                    onClick={() => setOpenTaskId(task.id)}
                                    key={task.id}
                                >
                                    <Box sx={{ maxWidth: 800 }}>
                                        <DateStampDivider
                                            date={lastTime.toISOString()}
                                        />
                                    </Box>
                                    <TaskHistoryCard task={task} />
                                </Box>
                            );
                        }
                    }
                    return component;
                })}
                {error && <Typography>Sorry, something went wrong.</Typography>}
                <div ref={ref} />
                {!isFinished && (
                    <Stack spacing={1} data-testid="task-history-skeleton">
                        {_.range(0, skeletonRange).map((i) => (
                            <Box key={i} sx={{ maxWidth: 1200 }}>
                                <Skeleton
                                    variant="rectangular"
                                    height={140}
                                    sx={{
                                        borderRadius: 4,
                                    }}
                                />
                            </Box>
                        ))}
                    </Stack>
                )}
            </Stack>
            {openTaskId && (
                <TaskHistoryTaskDialog
                    taskId={openTaskId}
                    onClose={() => setOpenTaskId(null)}
                />
            )}
        </>
    );
};

export default TaskHistory;
