import React from "react";
import { Link } from "react-router-dom";
import TaskCard from "./TaskCardsColoured";
import { encodeUUID } from "../../../utilities";
import PropTypes from "prop-types";
import { Grow } from "@material-ui/core";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import { contextDots } from "../../../styles/common";

const TaskItem = React.memo(function TaskItem(props) {
    const classes = contextDots();
    const { task } = props;
    const assignedCoordinators =
        task.assignees && task.assignees.items
            ? task.assignees.items
                  .filter((i) => i.role === "COORDINATOR")
                  .map((i) => i.assignee)
            : [];
    const assignedRiders =
        task.assignees && task.assignees.items
            ? task.assignees.items
                  .filter((i) => i.role === "RIDER")
                  .map((i) => i.assignee)
            : [];
    const assignedCoordinatorsDisplayString = assignedCoordinators
        .map((i) => i.displayName)
        .join(", ");
    const assignedRidersDisplayString = assignedRiders
        .map((i) => i.displayName)
        .join(", ");

    return (
        <Grow in {...(!props.animate ? { timeout: 0 } : {})}>
            <div style={{ cursor: "context-menu", position: "relative" }}>
                <Link
                    style={{ textDecoration: "none" }}
                    key={props.taskUUID}
                    to={{
                        pathname: `/task/${encodeUUID(props.taskUUID)}`,
                    }}
                >
                    <TaskCard
                        title={"Task"}
                        status={task.status}
                        priority={task.priority}
                        pickUpLocation={task.pickUpLocation}
                        dropOffLocation={task.dropOffLocation}
                        assignedRiders={assignedRiders}
                        assignedCoordinators={assignedCoordinators}
                        assignedRidersDisplayString={
                            assignedRidersDisplayString
                        }
                        assignedCoordinatorsDisplayString={
                            assignedCoordinatorsDisplayString
                        }
                    />
                </Link>
                <div className={classes.root}>
                    <TaskContextMenu
                        disableDeleted={props.deleteDisabled}
                        disableRelay={!!props.relayNext}
                        {...task}
                    />
                </div>
            </div>
        </Grow>
    );
});

TaskItem.defaultProps = {
    assignedRiders: [],
    assignedCoordinators: [],
    animate: true,
};

TaskItem.propTypes = {
    task: PropTypes.object,
    taskUUID: PropTypes.string,
    view: PropTypes.string,
    deleteDisabled: PropTypes.bool,
    animate: PropTypes.bool,
};

export default TaskItem;
