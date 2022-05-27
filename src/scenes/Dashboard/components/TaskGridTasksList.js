import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import React from "react";
import { showHide } from "../../../styles/common";
import { sortByCreatedTime } from "../../../utilities";
import TaskItem from "./TaskItem";
import DateStampDivider from "./TimeStampDivider";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    taskItem: {
        width: "100%",
    },
});

function TaskGridTasksList(props) {
    const { show, hide } = showHide();
    let displayDate = false;
    let lastTime = new Date();
    const classes = useStyles();
    const filteredTasksIdsList = props.includeList || [];
    return (
        <Stack
            direction={"column"}
            data-cy={`tasks-kanban-column-${props.taskKey}`}
            spacing={0}
            alignItems={"center"}
            justifyContent={"center"}
        >
            {sortByCreatedTime(Object.values(props.tasks), "newest").map(
                (task) => {
                    displayDate = false;
                    const timeComparison = new Date(
                        task.createdAt || task.timeOfCall || null
                    );
                    if (
                        timeComparison &&
                        (filteredTasksIdsList.length === 0 ||
                            filteredTasksIdsList.includes(task.id)) &&
                        timeComparison.getDate() <= lastTime.getDate() - 1
                    ) {
                        lastTime = timeComparison;
                        displayDate = true;
                    }
                    return (
                        <Box
                            className={clsx(
                                classes.taskItem,
                                props.includeList === null ||
                                    props.includeList.includes(task.id)
                                    ? show
                                    : hide
                            )}
                            key={task.id}
                        >
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                height={35}
                                sx={{ width: "100%" }}
                            >
                                {displayDate && (
                                    <DateStampDivider date={lastTime} />
                                )}
                            </Box>
                            <TaskItem
                                animate={props.animate}
                                task={task}
                                taskUUID={task.id}
                                deleteDisabled
                            />
                        </Box>
                    );
                }
            )}
        </Stack>
    );
}

TaskGridTasksList.defaultProps = {
    animate: false,
    tasks: {},
    includeList: [],
};

TaskGridTasksList.propTypes = {
    animate: PropTypes.bool,
    tasks: PropTypes.object,
    includeList: PropTypes.arrayOf(PropTypes.string),
};

export default TaskGridTasksList;
