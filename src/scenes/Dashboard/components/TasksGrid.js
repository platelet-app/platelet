import React from "react";
import _ from "lodash";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import { makeStyles } from "tss-react/mui";
import TasksGridColumn from "./TasksGridColumn";
import { dashboardFilteredUserSelector } from "../../../redux/Selectors";
import { useSelector } from "react-redux";
import { Divider, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as models from "../../../models";

const getColumnTitle = (key) => {
    if (key.includes(models.TaskStatus.DROPPED_OFF))
        key = [
            ...key.filter((status) => status !== models.TaskStatus.DROPPED_OFF),
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
        ? [...props.excludeColumnList, models.TaskStatus.NEW]
        : props.excludeColumnList;

    const columnCount = [
        [models.TaskStatus.NEW],
        [models.TaskStatus.ACTIVE],
        [models.TaskStatus.PICKED_UP],
        [models.TaskStatus.DROPPED_OFF],
        [models.TaskStatus.COMPLETED],
        [models.TaskStatus.CANCELLED],
        [models.TaskStatus.ABANDONED],
        [models.TaskStatus.REJECTED],
        [models.TaskStatus.PENDING],
    ].filter(
        (column) => _.intersection(excludeList, column).length === 0
    ).length;

    return (
        <Grid
            container
            spacing={0.5}
            direction={"row"}
            justifyContent={justifyContent}
            alignItems={"stretch"}
        >
            {[
                [models.TaskStatus.NEW],
                [models.TaskStatus.ACTIVE],
                [models.TaskStatus.PICKED_UP],
                [models.TaskStatus.DROPPED_OFF],
                [models.TaskStatus.COMPLETED],
                [models.TaskStatus.CANCELLED],
                [models.TaskStatus.ABANDONED],
                [models.TaskStatus.REJECTED],
                [models.TaskStatus.PENDING],
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
                                    columnCount={columnCount}
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
