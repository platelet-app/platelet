import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TaskCard from "./TaskCardsColoured";
import { encodeUUID } from "../../../utilities";
import PropTypes from "prop-types";
import { Grow } from "@material-ui/core";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import { contextDots } from "../../../styles/common";
import { userRoles } from "../../../apiConsts";
import * as models from "../../../models/index";
import { DataStore } from "aws-amplify";

function TaskItem(props) {
    const classes = contextDots();
    const { task } = props;
    const [assignedRiders, setAssignedRiders] = useState([]);
    const [assignedCoordinators, setAssignedCoordinators] = useState([]);
    const [assignedRidersDisplayString, setAssignedRidersDisplayString] =
        useState("");
    const [
        assignedCoordinatorsDisplayString,
        setAssignedCoordinatorsDisplayString,
    ] = useState("");

    // TODO: find out if this can be done more efficiently and avoided
    // i.e. get assignments from prop.task instead
    async function sortAssignees() {
        const assignees = (await DataStore.query(models.TaskAssignee)).filter(
            (a) => a.task.id === props.task.id
        );
        console.log(assignees);
        const riders = assignees
            .filter((assignment) => assignment.role === userRoles.rider)
            .map((a) => a.assignee);
        setAssignedRiders(riders);
        const ridersString = riders.map((u) => u.displayName).join(", ");
        setAssignedRidersDisplayString(ridersString);
        const coordinators = assignees
            .filter((assignment) => assignment.role === userRoles.coordinator)
            .map((a) => a.assignee);
        setAssignedCoordinators(coordinators);
        const coordsString = coordinators.map((u) => u.displayName).join(", ");
        setAssignedCoordinatorsDisplayString(coordsString);
    }

    useEffect(() => sortAssignees(), [props.task]);

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
}

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
