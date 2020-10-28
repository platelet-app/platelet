import React, {memo} from "react";
import Grid from "@material-ui/core/Grid";
import {Link, useLocation} from "react-router-dom";
import TaskCard from "./TaskCardsColoured"
import {encodeUUID} from "../../../utilities";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Tooltip from "@material-ui/core/Tooltip";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import {useDispatch} from "react-redux";
import {addTaskRelayRequest, updateTaskDropoffAddressRequest} from "../../../redux/tasks/TasksActions";



const TaskItem = React.memo((props) => {
    let location = useLocation();
    const task =
        <TaskCard
            title={"Task"}
            pickupAddress={props.task.pickup_address}
            dropoffAddress={props.task.dropoff_address}
            assignedUsers={props.task.assigned_riders_display_string}
            pickupTime={props.task.time_picked_up}
            dropoffTime={props.task.time_dropped_off}
            time_of_call={props.task.time_of_call}
            priority={props.task.priority}
            patch={props.task.patch}
        />;

    return (
        <>
            <Grid item key={props.task.uuid}>
                <div style={{cursor: 'context-menu', position: "relative"}}>
                    <Link style={{textDecoration: 'none'}}
                          key={props.task.uuid}

                          to={{pathname: `/task/${encodeUUID(props.task.uuid)}`, state: {prevPath: location.pathname}}}>
                        {task}
                    </Link>
                    <div style={{cursor: 'context-menu', position: "absolute", bottom: 0, right: 0, zIndex: 1000}}>
                        <TaskContextMenu
                            taskUUID={props.task.uuid}
                            deleteDisabled={props.deleteDisabled}
                            pickupTime={props.task.time_picked_up}
                            dropoffTime={props.task.time_dropped_off}
                            assignedUsers={props.task.assigned_riders}
                            cancelledTime={props.task.time_cancelled}
                            rejectedTime={props.task.time_rejected}
                        />
                    </div>
                </div>

            </Grid>
        </>
    )
});

export default TaskItem;
