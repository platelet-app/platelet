import React from "react";
import { Skeleton, Stack, Typography } from "@mui/material";
import useScheduledTasks from "../../hooks/useScheduledTasks";
import AddToListButton from "../../components/AddToListButton";
import _ from "lodash";

const ScheduledTasks = () => {
    const { state, isFetching, error } = useScheduledTasks();
    if (isFetching) {
        return (
            <Stack data-testid="scheduled-tasks-skeleton" spacing={1}>
                {_.range(0, 5).map((i) => (
                    <Skeleton key={i} variant="rectangular" height={118} />
                ))}
            </Stack>
        );
    } else if (error) {
        return <Typography>Sorry, something went wrong.</Typography>;
    } else {
        return (
            <>
                <Stack>
                    {state.map((task) => (
                        <div key={task.id}>{task.id}</div>
                    ))}
                    <AddToListButton
                        onClick={() => {}}
                        label="Add scheduled task"
                    />
                </Stack>
            </>
        );
    }
};

export default ScheduledTasks;
