import React from "react";
import { Skeleton, Stack, Typography } from "@mui/material";
import { useInView } from "react-intersection-observer";
import useGetTasksGraphql from "../../hooks/useGetTasksGraphql";
import _ from "lodash";
import TaskHistoryCard from "./components/TaskHistoryCard";

const TaskHistory: React.FC = () => {
    const { state, getNext, finished, error } = useGetTasksGraphql();
    const { ref, inView } = useInView({
        threshold: 0,
    });

    React.useEffect(() => {
        if (inView && !finished) {
            getNext();
        }
    }, [inView, getNext, state, finished]);

    return (
        <>
            <Stack spacing={1}>
                {state.map((task) => (
                    <TaskHistoryCard key={task.id} task={task} />
                ))}
                {error && <Typography>Sorry, something went wrong.</Typography>}
                <div ref={ref} />
                {!finished &&
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
