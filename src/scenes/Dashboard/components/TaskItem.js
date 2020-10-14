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
import {addTaskRelayRequest} from "../../../redux/tasks/TasksActions";


const useStyles = makeStyles(theme => ({
    addRelay: {
        visibility: "hidden",
        "&:hover $hoverDiv": {
            visibility: "visible"
        }
    },
    hoverDiv: {
        width: "100%",
        height: "45px",
        "& .hidden-button": {
            display: "none"
        },
        "&:hover .hidden-button": {
            display: "inline"
        }
    }
}));
const TaskItem = React.memo((props) => {
    let location = useLocation();
    const classes = useStyles();
    const dispatch = useDispatch();

    const emptyTask = {
        time_created: new Date().toISOString(),
        assigned_riders: [],
        assigned_coordinators: [],
        time_picked_up: null,
        time_dropped_off: null,
        time_rejected: null,
        time_cancelled: null
    };


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
            {props.task.relay_next ?
                <>
                <Grid alignItems={"center"} justify={"center"} className={classes.hoverDiv}>
                    <Grid item>
                    <Tooltip title="Relay">
                            <ArrowDownwardIcon style={{height: "45px"}}/>

                    </Tooltip>
                    </Grid>
                </Grid>
                    <TaskItem key={props.task.relay_next.uuid}
                              task={props.task.relay_next}
                              view={props.view}
                              deleteDisabled={props.deleteDisabled}/>
                              </>
                :
                <Grid alignItems={"center"} justify={"center"} className={classes.hoverDiv}>
                    <Grid item>
                        <Tooltip title={"Add Relay"}>
                        <IconButton
                            className={"hidden-button"}
                            onClick={() => {
                                const {requester_contact, priority, priority_id, time_of_call, dropoff_address} = {...props.task}
                                dispatch(addTaskRelayRequest({
                                    ...emptyTask,
                                    time_of_call,
                                    requester_contact,
                                    priority,
                                    priority_id,
                                    pickup_address: dropoff_address,
                                    relay_previous_uuid: props.task.uuid
                                }))
                            }}
                        >
                            <ArrowDownwardIcon/>
                        </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            }
        </>
    )
});

export default TaskItem;
