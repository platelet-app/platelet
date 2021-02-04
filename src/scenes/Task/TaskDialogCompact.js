import React, {useEffect, useRef, useState} from "react";
import Grid from "@material-ui/core/Grid";
import LocationDetailAndSelector from "./components/LocationDetailAndSelector";
import StatusBar from "./components/StatusBar";
import Dialog from "@material-ui/core/Dialog";
import {useHistory, useLocation} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {decodeUUID, findExistingTask, findExistingTaskParent} from "../../utilities";
import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import resolvePath from "object-resolve-path";
import {getTaskRequest} from "../../redux/tasks/TasksActions";
import {getActionsRecordRequest} from "../../redux/actionsRecord/ActionsRecordActions";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function TaskDialogCompact(props) {
    const mobileView = useSelector(state => state.mobileView);
    const tasks = useSelector(state => state.tasks.tasks);
    const listType = useRef(undefined)
    const parentID = useRef(undefined)
    const history = useHistory();
    const dispatch = useDispatch();
    const task = useSelector(state => state.task.task);

    let taskUUID = null;

    if (props.match) {
        taskUUID = decodeUUID(props.match.params.task_uuid_b62) // everything before the query string
    }

    if (props.match) {
        taskUUID = decodeUUID(props.match.params.task_uuid_b62)
    } else {
        taskUUID = task.uuid;
    }

    function componentDidMount() {
        dispatch(getTaskRequest(taskUUID))
    }
    useEffect(componentDidMount, [props.location.key]);

    function findTask() {
        const {lt, pid} = findExistingTaskParent(taskUUID)
        listType.current = lt
        parentID.current = pid

    }
    useEffect(findTask, [tasks])

    //if (taskParent && listType && taskUUID)
    //    task = tasks[listType][taskParent][taskUUID]


    let handleClose = e => {
        e.stopPropagation();
        if (props.location.state)
            history.goBack();
        else
            history.push("/");

    };
    const statusBar = !task ? <></> :
        <StatusBar
            relayNext={task.relay_next ? task.relay_next.uuid : null}
            relayPrevious={task.relay_previous ? task.relay_previous.uuid : null}
            handleClose={handleClose}
            assignedRiders={task.assigned_riders}
            assignedCoordinators={task.assigned_coordinators}
            assignedCoordinatorsDisplayString={task.assigned_coordinators_display_string}
            assignedRidersDisplayString={task.assigned_riders_display_string}
            taskUUID={taskUUID}
        />

        if (!task){
            return <Dialog open={true}><FormSkeleton/></Dialog>
        } else {
            return (
                <Dialog
                    fullScreen={mobileView}
                    maxWidth={"lg"}
                    fullWidth={true}
                    open={true}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            backgroundColor: "rgb(240, 240, 240)",
                            boxShadow: 'none',
                        },
                    }}
                    aria-labelledby="form-dialog-title">
                    {statusBar}
                    <Grid container direction={"row"} justify={"space-between"} alignItems={"center"}>
                        <Grid item>
                            <LocationDetailAndSelector location={task.pickup_location} label={"Pick up"}/>
                        </Grid>
                    </Grid>
                </Dialog>
            )
        }

}

export default TaskDialogCompact;
