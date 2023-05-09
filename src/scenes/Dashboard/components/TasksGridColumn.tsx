import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { Skeleton, Stack, useMediaQuery } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { dashboardFilterTermSelector } from "../../../redux/Selectors";
import { filterTasks } from "../utilities/functions";
import GetError from "../../../ErrorComponents/GetError";
import Box from "@mui/material/Box";
import useWindowSize from "../../../hooks/useWindowSize";
import { useTheme } from "@mui/material/styles";
import TaskGridColumnHeader from "./TaskGridColumnHeader";
import TaskGridTasksList from "./TaskGridTasksList";
import useTasksColumnTasks from "../../../hooks/useTasksColumnTasks";
import * as models from "../../../models";

const useStyles = makeStyles()((theme) => ({
    divider: {
        width: "95%",
    },
    spacer: {
        height: 35,
    },
    column: {
        padding: 5,
        //backgroundColor: "rgba(180, 180, 180, 0.1)",
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
    taskKey: models.TaskStatus[];
    showTasks?: string[];
    hideRelayIcons?: boolean;
};

const TasksGridColumn: React.FC<TasksGridColumnProps> = ({
    title = "TASKS",
    taskKey,
}) => {
    const { state, isFetching, error } = useTasksColumnTasks(taskKey);
    const [filteredTasksIds, setFilteredTasksIds] = useState<string[] | null>(
        null
    );
    const [width] = useWindowSize();
    const dashboardFilter = useSelector(dashboardFilterTermSelector);
    const theme = useTheme();
    const { classes } = useStyles();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
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
                data-testid="tasks-kanban-column-skeleton"
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
                <TaskGridColumnHeader tasks={state} title={title} />
                <TaskGridTasksList
                    data-testid={`tasks-kanban-column-${taskKey}`}
                    tasks={state}
                    includeList={filteredTasksIds}
                />
            </Box>
        );
    }
};
TasksGridColumn.defaultProps = {
    showTasks: [],
    title: "TASKS",
    hideRelayIcons: false,
};
export default TasksGridColumn;
