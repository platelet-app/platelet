import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TaskCard from "./TaskCardsColoured";
import {
    convertListDataToObject,
    determineTaskStatus,
    encodeUUID,
} from "../../../utilities";
import PropTypes from "prop-types";
import { Grow } from "@mui/material";
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

    async function setTimeValue(value, key) {
        const result = await DataStore.query(models.Task, props.taskUUID);
        const assignees = (await DataStore.query(models.TaskAssignee)).filter(
            (a) => a.task.id === props.taskUUID
        );
        const status = determineTaskStatus({
            ...result,
            [key]: value,
            assignees: convertListDataToObject(assignees),
        });
        await DataStore.save(
            models.Task.copyOf(result, (updated) => {
                updated[key] = value;
                updated.status = status;
            })
        );
    }

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
                        timeOfCall={task.timeOfCall}
                        priority={task.priority}
                        pickUpLocation={task.pickUpLocation}
                        riderResponsibility={
                            task.riderResponsibility
                                ? task.riderResponsibility.label
                                : ""
                        }
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
                        onSetTimePickedUp={(value) =>
                            setTimeValue(value, "timePickedUp")
                        }
                        onSetTimeDroppedOff={(value) =>
                            setTimeValue(value, "timeDroppedOff")
                        }
                        onSetTimeCancelled={(value) =>
                            setTimeValue(value, "timeCancelled")
                        }
                        onSetTimeRejected={(value) =>
                            setTimeValue(value, "timeRejected")
                        }
                        assignedRiders={assignedRiders}
                        task={task}
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
