import React from "react";
import * as models from "../../../models";
import _ from "lodash";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import TasksGridColumn from "./TasksGridColumn";
import { dashboardFilteredUserSelector } from "../../../redux/Selectors";
import { useSelector } from "react-redux";

const getColumnTitle = (key) => {
    if (key === models.TaskStatus.DROPPED_OFF) key = "DELIVERED";
    return key;
};

const useStyles = makeStyles((theme) => ({
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
    const classes = useStyles();
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);

    let justifyContent = "flex-start";

    const excludeList = dashboardFilteredUser
        ? [...props.excludeColumnList, models.TaskStatus.NEW]
        : props.excludeColumnList;

    return (
        <Grid
            container
            spacing={1}
            direction={"row"}
            justifyContent={justifyContent}
            alignItems={"stretch"}
        >
            {[
                models.TaskStatus.NEW,
                models.TaskStatus.ACTIVE,
                models.TaskStatus.PICKED_UP,
                models.TaskStatus.DROPPED_OFF,
                models.TaskStatus.COMPLETED,
                models.TaskStatus.CANCELLED,
                models.TaskStatus.ABANDONED,
                models.TaskStatus.REJECTED,
            ]
                .filter(
                    (column) => _.intersection(excludeList, column).length === 0
                )
                .map((taskKey) => {
                    console.log(taskKey);
                    const title = getColumnTitle(taskKey);
                    return (
                        <Grid item key={title} className={classes.column}>
                            <TasksGridColumn
                                title={title}
                                onAddTaskClick={props.onAddTaskClick}
                                taskKey={taskKey}
                                showTasks={props.showTaskIds}
                            />
                        </Grid>
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
