import React from "react";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import { showHide } from "../../../styles/common";
import TaskItem from "./TaskItem";
import DateStampDivider from "../../../components/DateStampDivider";

export function sortByCreatedTime(items, order = "newest") {
    if (!items || items.length === 0) return [];
    if (order !== "newest") {
        return items.sort((a, b) => {
            return (
                new Date(a.createdAt || a.timeOfCall) -
                new Date(b.createdAt || b.timeOfCall)
            );
        });
    } else {
        return items.sort((a, b) => {
            return (
                new Date(b.createdAt || b.timeOfCall) -
                new Date(a.createdAt || a.timeOfCall)
            );
        });
    }
}

function TaskGridTasksList(props) {
    const { show, hide } = showHide().classes;
    let displayDate = false;
    let lastTime = new Date();
    const filteredTasksIdsList = props.includeList || [];
    return (
        <Stack
            direction={"column"}
            spacing={1}
            data-cy={props.datacy}
            alignItems={"center"}
            justifyContent={"center"}
        >
            {sortByCreatedTime(Object.values(props.tasks), "oldest")
                // sort by oldest and reverse so that undefined createdAt is at the top
                .reverse()
                .map((task) => {
                    displayDate = false;
                    const timeComparison = new Date(
                        task.createdAt || task.timeOfCall || null
                    );
                    if (
                        timeComparison &&
                        (filteredTasksIdsList.length === 0 ||
                            filteredTasksIdsList.includes(task.id)) &&
                        timeComparison.getDate() !== lastTime.getDate()
                    ) {
                        lastTime = timeComparison;
                        displayDate = true;
                    }
                    return (
                        <Box
                            sx={{ width: "100%" }}
                            className={
                                props.includeList === null ||
                                props.includeList.includes(task.id)
                                    ? show
                                    : hide
                            }
                            key={task.id}
                        >
                            {displayDate && (
                                <DateStampDivider calendar date={lastTime} />
                            )}
                            <TaskItem
                                animate={props.animate}
                                task={task}
                                taskUUID={task.id}
                            />
                        </Box>
                    );
                })}
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
