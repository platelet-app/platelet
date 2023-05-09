import React from "react";
import { Skeleton, Stack, Typography } from "@mui/material";
import useScheduledTasks from "../../hooks/useScheduledTasks";
import AddToListButton from "../../components/AddToListButton";
import _ from "lodash";
import ScheduledTaskCard from "./components/ScheduledTaskCard";
import { useSelector } from "react-redux";
import { getWhoami } from "../../redux/Selectors";
import * as models from "../../models";

const ScheduledTasks = () => {
    const { state, isFetching, error } = useScheduledTasks();
    const whoami = useSelector(getWhoami);

    if (isFetching) {
        return (
            <Stack
                sx={{ maxWidth: 800 }}
                data-testid="scheduled-tasks-skeleton"
                spacing={1}
            >
                {_.range(0, 5).map((i) => (
                    <Skeleton key={i} variant="rectangular" height={118} />
                ))}
            </Stack>
        );
    } else if (error) {
        return <Typography>Sorry, something went wrong.</Typography>;
    } else {
        return (
            <Stack spacing={1} sx={{ maxWidth: 800 }}>
                {whoami.roles.includes(models.Role.ADMIN) && (
                    <AddToListButton
                        link="/admin/add-scheduled"
                        label="Add scheduled task"
                    />
                )}
                {state.map((task) => (
                    <ScheduledTaskCard key={task.id} task={task} />
                ))}
            </Stack>
        );
    }
};

export default ScheduledTasks;
