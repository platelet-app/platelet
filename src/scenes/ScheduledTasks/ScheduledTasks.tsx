import React from "react";
import { Stack } from "@mui/material";
import useScheduledTasks from "../../hooks/useScheduledTasks";

const ScheduledTasks = () => {
    const { state, isFetching, error } = useScheduledTasks();
    return (
        <Stack>
            {state.map((task) => (
                <div key={task.id}>{task.id}</div>
            ))}
        </Stack>
    );
};

export default ScheduledTasks;
