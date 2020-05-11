import React from "react";
import Grid from "@material-ui/core/Grid";
import {Link, useLocation} from "react-router-dom";
import {TaskCard} from "./TaskCardsColoured"
import {encodeUUID} from "../utilities";
import TaskContextMenu from "./ContextMenus/TaskContextMenu";

export default function TaskItem(props) {
    const currentLocation = useLocation();
    const task =
        <TaskCard
            title={"Task"}
            pickupAddress={props.task.pickup_address}
            dropoffAddress={props.task.dropoff_address}
            // Only calculate the assignee list if we have to
            assignedUsers={props.task.assigneeList || props.task.assigned_users.map((user) => user.display_name).join(", ")}
            pickupTime={props.task.time_picked_up}
            dropoffTime={props.task.time_dropped_off}
            time_of_call={props.task.time_of_call}
            priority={props.task.priority}
            patch={props.task.patch}
        />;

    return (
        <Grid item key={props.task.uuid}>
            <div style={{cursor: 'context-menu', position: "relative"}}>
                <Link style={{textDecoration: 'none'}}
                      key={props.task.uuid}
                      to={`${currentLocation.pathname}/task/${encodeUUID(props.task.uuid)}`}>
                    {task}
                </Link>
                <div style={{cursor: 'context-menu', position: "absolute", bottom: 0, right: 0, zIndex: 1000}}>
                    <TaskContextMenu
                        taskUUID={props.task.uuid}
                        deleteDisabled={props.deleteDisabled}
                        pickupTime={props.task.time_picked_up}
                        dropoffTime={props.task.time_dropped_off}
                        assignedRider={props.task.assigned_rider}
                        cancelledTime={props.task.time_cancelled}
                        rejectedTime={props.task.time_rejected}
                    />
                </div>
            </div>

        </Grid>
    )
};
