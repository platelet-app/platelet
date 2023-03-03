import React from "react";
import { Skeleton, Stack } from "@mui/material";
import { useInView } from "react-intersection-observer";
import useGetTasksGraphql from "../hooks/useGetTasksGraphql";
import _ from "lodash";

const TaskHistory: React.FC = () => {
    const { state, getNext, finished } = useGetTasksGraphql();
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
            <Stack>
                {state.map((task) => (
                    <div>{task.id}</div>
                ))}
                <div ref={ref} />
            </Stack>
            {!finished && (
                <Stack>
                    {_.range(0, 10).map((i) => (
                        <Skeleton key={i} />
                    ))}
                </Stack>
            )}
        </>
    );
};

export default TaskHistory;
