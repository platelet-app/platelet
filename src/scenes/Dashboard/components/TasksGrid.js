import React, { useState } from "react";
import _ from "lodash";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { GuidedSetup } from "../../GuidedSetup/GuidedSetup";
import TasksGridColumn from "./TasksGridColumn";
import { tasksStatus, userRoles } from "../../../apiConsts";
import { getRoleView } from "../../../redux/Selectors";
import { useSelector } from "react-redux";

const getColumnTitle = (key) => {
    if (key.includes(tasksStatus.new)) return "New".toUpperCase();
    else if (key.includes(tasksStatus.active)) return "Active".toUpperCase();
    else if (key.includes(tasksStatus.pickedUp))
        return "Picked Up".toUpperCase();
    else if (key.includes(tasksStatus.droppedOff))
        return "Delivered".toUpperCase();
    else if (key.includes(tasksStatus.rejected))
        return "Rejected".toUpperCase();
    else if (key.includes(tasksStatus.cancelled))
        return "Cancelled".toUpperCase();
    else return "";
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
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
    },
}));

function TasksGrid(props) {
    const classes = useStyles();
    const [showGuidedSetup, setShowGuidedSetup] = useState(false);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const isMd = useMediaQuery(theme.breakpoints.down("lg"));
    const roleView = useSelector(getRoleView);

    let justifyContent = "space-evenly";
    if (isSm) {
        justifyContent = "center";
    } else if (roleView && roleView.toUpperCase() === userRoles.rider) {
        justifyContent = "flex-start";
    } else if (isMd) {
        justifyContent = "flex-start";
    }

    return (
        <>
            <Grid
                container
                spacing={2}
                direction={"row"}
                justifyContent={justifyContent}
                alignItems={"stretch"}
            >
                {[
                    [tasksStatus.new],
                    [tasksStatus.active],
                    [tasksStatus.pickedUp],
                    [tasksStatus.droppedOff, tasksStatus.completed],
                    [tasksStatus.cancelled],
                    [tasksStatus.rejected],
                ]
                    .filter(
                        (column) =>
                            _.intersection(props.excludeColumnList, column)
                                .length === 0
                    )
                    .map((taskKey) => {
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
            <GuidedSetup
                show={showGuidedSetup}
                onClose={() => setShowGuidedSetup(false)}
            />
        </>
    );
}

TasksGrid.propTypes = {
    fullScreenModal: PropTypes.bool,
    modalView: PropTypes.string,
    hideRelayIcons: PropTypes.bool,
    hideAddButton: PropTypes.bool,
    excludeColumnList: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
};

export default TasksGrid;
