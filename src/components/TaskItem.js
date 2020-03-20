import React from "react";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import {TaskCard} from "./TaskCardsColoured"
import {encodeUUID} from "../utilities";
import TaskContextMenu from "./TaskContextMenu";

export default function TaskItem(props) {
    return (
        <Grid item key={props.task.uuid}>
            <TaskContextMenu
                taskUUID={props.task.uuid}
                deleteDisabled={props.deleteDisabled}
                pickupTime={props.task.pickup_time}
                dropoffTime={props.task.dropoff_time}
                assignedRider={props.task.assigned_rider}
                cancelledTime={props.task.cancelled_time}
                rejectedTime={props.task.rejected_time}
            >
                <Link style={{textDecoration: 'none'}}
                      key={props.task.uuid}
                      to={{
                          pathname: `/session/${encodeUUID(props.task.session_uuid)}/task/${encodeUUID(props.task.uuid)}`,
                          state: {
                              background: props.location,
                              view: props.view,
                              fullscreen: props.fullScreenModal
                          }
                      }}
                >
                    <TaskCard
                        title={"Task"}
                        pickupAddress={props.task.pickup_address}
                        dropoffAddress={props.task.dropoff_address}
                        assignedRider={props.task.rider}
                        pickupTime={props.task.pickup_time}
                        dropoffTime={props.task.dropoff_time}
                        timestamp={props.task.timestamp}
                        priority={props.task.priority}
                    />
                </Link>
            </TaskContextMenu>

        </Grid>
    )
};
