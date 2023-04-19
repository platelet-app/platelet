import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { Skeleton, Stack, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import { makeStyles } from "tss-react/mui";
import { dashboardFilterTermSelector } from "../../../redux/Selectors";
import { filterTasks } from "../utilities/functions";
import GetError from "../../../ErrorComponents/GetError";
import Box from "@mui/material/Box";
import useWindowSize from "../../../hooks/useWindowSize";
import { useTheme } from "@mui/styles";
import TaskGridColumnHeader from "./TaskGridColumnHeader";
import TaskGridTasksList from "./TaskGridTasksList";
import useTasksColumnTasks from "../../../hooks/useTasksColumnTasks";

const useStyles = makeStyles()((theme) => ({
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

function TasksGridColumn(props) {
    console.log("TasksGridColumn", props.taskKey);
    const { state, isFetching, error } = useTasksColumnTasks(props.taskKey);
    const [filteredTasksIds, setFilteredTasksIds] = useState(null);
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
                className={classes.column}
                sx={{
                    width: isSm ? "100%" : width / 4.2,
                }}
            >
                <Stack direction="column" spacing={4}>
                    <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        data-cy={`${props.title}-title-skeleton`}
                        height={50}
                    />
                    {_.range(4).map((i) => (
                        <Box key={i} className={classes.taskItem}>
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
                <TaskGridColumnHeader tasks={state} title={props.title} />
                <TaskGridTasksList
                    datacy={`tasks-kanban-column-${props.taskKey}`}
                    tasks={state}
                    includeList={filteredTasksIds}
                />
            </Box>
        );
    }
}

TasksGridColumn.propTypes = {
    title: PropTypes.string,
    taskKey: PropTypes.array.isRequired,
    showTasks: PropTypes.arrayOf(PropTypes.string),
    hideRelayIcons: PropTypes.bool,
};

TasksGridColumn.defaultProps = {
    showTasks: [],
    title: "TASKS",
    hideRelayIcons: false,
};

export default TasksGridColumn;
