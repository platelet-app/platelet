import React from "react";
import _ from "lodash";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import { makeStyles } from "tss-react/mui";
import TasksGridColumn from "./TasksGridColumn";
import { tasksStatus } from "../../../apiConsts";
import { dashboardFilteredUserSelector } from "../../../redux/Selectors";
import { useSelector } from "react-redux";
import { Divider, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const getColumnTitle = (key) => {
    if (key.includes(tasksStatus.droppedOff))
        key = [
            ...key.filter((status) => status !== tasksStatus.droppedOff),
            "DELIVERED",
        ];

    return key.join(" / ").replace(/_/g, " ");
};

const useStyles = makeStyles()((theme) => ({
    addRelay: {
        visibility: "hidden",
        "&:hover $hoverDiv": {
            visibility: "visible",
        },
    },
    header: {
        fontWeight: "bold",
        padding: "6px",
    },
    divider: {
        width: "95%",
    },
    spacer: {
        height: 35,
    },
    taskItem: {
        width: "100%",
    },
    column: {
        [theme.breakpoints.down("sm")]: {
            width: "100%",
        },
    },
}));

function TasksGrid(props) {
    const { classes } = useStyles();
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    let justifyContent = "flex-start";

    const excludeList = dashboardFilteredUser
        ? [...props.excludeColumnList, tasksStatus.new]
        : props.excludeColumnList;

    return (
        <Grid
            container
            spacing={0.5}
            direction={"row"}
            justifyContent={justifyContent}
            alignItems={"stretch"}
        >
            {[
                [tasksStatus.new],
                [tasksStatus.active],
                [tasksStatus.pickedUp],
                [tasksStatus.droppedOff],
                [tasksStatus.completed],
                [tasksStatus.cancelled],
                [tasksStatus.abandoned],
                [tasksStatus.rejected],
            ]
                .filter(
                    (column) => _.intersection(excludeList, column).length === 0
                )
                .map((taskKey) => {
                    const title = getColumnTitle(taskKey);
                    return (
                        <>
                            <Grid item key={title} className={classes.column}>
                                <TasksGridColumn
                                    title={title}
                                    onAddTaskClick={props.onAddTaskClick}
                                    taskKey={taskKey}
                                    showTasks={props.showTaskIds}
                                />
                            </Grid>
                            {!isSm && (
                                <Grid item key={`${title}-divider`}>
                                    <Divider orientation="vertical" />
                                </Grid>
                            )}
                        </>
                    );
                })}
        </Grid>
    );
}

TasksGrid.propTypes = {
    fullScreenModal: PropTypes.bool,
    modalView: PropTypes.string,
    hideRelayIcons: PropTypes.bool,
    excludeColumnList: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
};

export default TasksGrid;
