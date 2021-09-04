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
    console.log("AFJFJFJFJF");
    console.log(props.assignedCoordinators);
    return (
        <Grow in {...(!props.animate ? { timeout: 0 } : {})}>
            <div style={{ cursor: "context-menu", position: "relative" }}>
                {props.statusHumanReadable}
                <Link
                    style={{ textDecoration: "none" }}
                    key={props.taskUUID}
                    to={{
                        pathname: `/task/${encodeUUID(props.taskUUID)}`,
                    }}
                >
                    {props.assignedRiders.map((i) => i.displayName)}
                    {props.assignedCoordinators
                        .map((i) => i.displayName)
                        .join(",")}
                    <TaskCard title={"Task"} {...props} />
                </Link>
                <div className={classes.root}>
                    <TaskContextMenu
                        disableDeleted={props.deleteDisabled}
                        disableRelay={!!props.relayNext}
                        {...props}
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
    pickupAddress: PropTypes.object,
    assignedCoordinatorsDisplayString: PropTypes.string,
    assignedRidersDisplayString: PropTypes.string,
    dropoffAddress: PropTypes.object,
    timePickedUp: PropTypes.string,
    timeDroppedOff: PropTypes.string,
    timeRejected: PropTypes.string,
    timeCancelled: PropTypes.string,
    timeOfCall: PropTypes.string,
    priority: PropTypes.string,
    patch: PropTypes.string,
    relayNext: PropTypes.object,
    taskUUID: PropTypes.string,
    parentID: PropTypes.number,
    view: PropTypes.string,
    deleteDisabled: PropTypes.bool,
    animate: PropTypes.bool,
};

TaskItem.whyDidYouRender = true;

export default TaskItem;
