import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import * as models from "../../../models/index";
import { useSelector } from "react-redux";
import { Skeleton, Stack, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
    dashboardFilteredUserSelector,
    getRoleView,
    getWhoami,
    dashboardFilterTermSelector,
} from "../../../redux/Selectors";
import { filterTasks } from "../utilities/functions";
import GetError from "../../../ErrorComponents/GetError";
import Box from "@mui/material/Box";
import useWindowSize from "../../../hooks/useWindowSize";
import { useTheme } from "@mui/material/styles";
import TaskGridColumnHeader from "./TaskGridColumnHeader";
import TaskGridTasksList from "./TaskGridTasksList";
import useTasks from "../../../hooks/useTasks";

const useStyles = makeStyles((theme: any) => ({
    divider: {
        width: "95%",
    },
    spacer: {
        height: 35,
    },
    column: {
        padding: 5,
        backgroundColor: "rgba(180, 180, 180, 0.1)",
        borderRadius: 5,
        border: 0,
        boxShadow: "0 2px 3px 1px rgba(100, 100, 100, .3)",
        height: "100%",
        maxWidth: 360,
        minWidth: 285,
        [theme.breakpoints.down("lg")]: {
            padding: 0,
        },
        [theme.breakpoints.down("sm")]: {
            maxWidth: "100%",
            width: "100%",
        },
    },
    gridItem: {
        width: "100%",
    },
}));

type TasksGridColumnProps = {
    title?: string;
    taskKey: models.TaskStatus;
    showTasks?: string[];
};

const TasksGridColumn: React.FC<TasksGridColumnProps> = ({
    title = "TASKS",
    taskKey,
    showTasks = [],
}) => {
    const stateRef = useRef({});
    const [filteredTasksIds, setFilteredTasksIds] = useState<string[] | null>(
        null
    );
    const [width] = useWindowSize();
    const whoami = useSelector(getWhoami);
    const dashboardFilter = useSelector(dashboardFilterTermSelector);
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const roleView = useSelector(getRoleView);

    const { state, isFetching, error } = useTasks(
        whoami.id,
        roleView,
        taskKey,
        dashboardFilteredUser
    );
    const tasks = Object.values(state);

    const theme = useTheme();

    const classes = useStyles();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    stateRef.current = state;

    /*function addTaskToState(newTask) {
        animate.current = true;
        setState((prevState) => ({
            ...prevState,
            [newTask.id]: newTask,
        }));
        animate.current = false;
    }

    function removeTaskFromState(newTask) {
        setState((prevState) => {
            if (prevState[newTask.id]) return _.omit(prevState, newTask.id);
            else return prevState;
        });
    }*/

    function doSearch() {
        const searchResult = filterTasks(state, dashboardFilter);
        setFilteredTasksIds(searchResult);
    }

    useEffect(doSearch, [dashboardFilter, state]);

    if (error) {
        return <GetError />;
    } else if (isFetching) {
        return (
            <Box
                data-testid="fetching-tasks-grid-column"
                className={classes.column}
                sx={{
                    width: isSm ? "100%" : width / 4.2,
                }}
            >
                <Stack direction="column" spacing={4}>
                    <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        data-cy={`${title}-title-skeleton`}
                        height={50}
                    />
                    {_.range(4).map((i) => (
                        <Box key={i}>
                            <Skeleton
                                variant="rectangular"
                                width={"100%"}
                                height={200}
                            />
                        </Box>
                    ))}
                </Stack>
            </Box>
        );
    } else {
        return (
            <Box
                className={classes.column}
                sx={{
                    width: isSm ? "100%" : width / 4.2,
                }}
            >
                <TaskGridColumnHeader tasks={tasks} title={title} />
                <TaskGridTasksList
                    tasks={tasks}
                    includeList={filteredTasksIds}
                />
            </Box>
        );
    }
};

export default TasksGridColumn;
