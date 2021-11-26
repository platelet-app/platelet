import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TaskCard from "./TaskCardsColoured";
import {
    convertListDataToObject,
    determineTaskStatus,
    encodeUUID,
} from "../../../utilities";
import PropTypes from "prop-types";
import { Grow, Skeleton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import { userRoles } from "../../../apiConsts";
import * as models from "../../../models/index";
import { DataStore } from "aws-amplify";
import useOnScreen from "../../../hooks/useOnScreen";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
        "&:hover": {
            "& $dots": {
                display: "inline",
            },
        },
    },
    dots: () => {
        const background =
            theme.palette.mode === "dark"
                ? "radial-gradient(circle, rgba(64,64,64,1) 30%, rgba(0,0,0,0) 100%)"
                : `radial-gradient(circle, ${theme.palette.background.paper} 30%, rgba(0,0,0,0) 100%)`;
        return {
            background: background,
            borderRadius: "1em",
            position: "absolute",
            bottom: 4,
            right: 4,
            display: "none",
            zIndex: 90,
        };
    },
}));

function TaskItem(props) {
    const classes = useStyles();
    const { task } = props;
    const [assignedRiders, setAssignedRiders] = useState([]);
    const [assignedCoordinators, setAssignedCoordinators] = useState([]);
    const [assignedRidersDisplayString, setAssignedRidersDisplayString] =
        useState("");
    const [
        assignedCoordinatorsDisplayString,
        setAssignedCoordinatorsDisplayString,
    ] = useState("");
    const ref = React.useRef();
    const isVisible = useOnScreen(ref);
    const [visibility, setVisibility] = useState(false);

    useEffect(() => {
        if (isVisible && !visibility) {
            setVisibility(true);
        }
    }, [isVisible]);

    // TODO: find out if this can be done more efficiently and avoided
    // i.e. get assignments from prop.task instead
    function sortAssignees() {
        if (!isVisible) return;
        const riders =
            props.task && props.task.assignees
                ? Object.values(props.task.assignees)
                      .filter(
                          (assignment) => assignment.role === userRoles.rider
                      )
                      .map((a) => a.assignee)
                : [];
        setAssignedRiders(riders);
        const ridersString = riders.map((u) => u.displayName).join(", ");
        setAssignedRidersDisplayString(ridersString);
        const coordinators =
            props.task && props.task.assignees
                ? Object.values(props.task.assignees)
                      .filter(
                          (assignment) =>
                              assignment.role === userRoles.coordinator
                      )
                      .map((a) => a.assignee)
                : [];
        setAssignedCoordinators(coordinators);
        const coordsString = coordinators.map((u) => u.displayName).join(", ");
        setAssignedCoordinatorsDisplayString(coordsString);
    }

    useEffect(sortAssignees, [props.assignees, isVisible]);

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

    const location = useLocation();

    const contents = visibility ? (
        <Grow in {...(!props.animate ? { timeout: 0 } : {})}>
            <div
                className={classes.root}
                style={{ cursor: "context-menu", position: "relative" }}
            >
                <Link
                    style={{ textDecoration: "none" }}
                    to={{
                        pathname: `/task/${encodeUUID(props.taskUUID)}`,
                        state: { background: location },
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
                <div className={classes.dots}>
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
    ) : (
        <Skeleton variant="rectangle" width="100%" height={200} />
    );
    return (
        <>
            <div ref={ref} />
            {contents}
        </>
    );
}

TaskItem.defaultProps = {
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
