import React, {useEffect, useRef} from "react";
import Grid from "@material-ui/core/Grid";
import LocationDetailAndSelector from "./components/LocationDetailAndSelector";
import StatusBar from "./components/StatusBar";
import Dialog from "@material-ui/core/Dialog";
import {useHistory, useLocation} from "react-router";
import {useSelector} from "react-redux";
import {decodeUUID, findExistingTask, findExistingTaskParent} from "../../utilities";
import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import resolvePath from "object-resolve-path";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function TaskDialogCompact(props) {
    const mobileView = useSelector(state => state.mobileView);
    const tasks = useSelector(state => state.tasks.tasks);
    const listType = useRef(undefined)
    const parentID = useRef(undefined)
    const history = useHistory();

    let taskUUID = null;

    if (props.match) {
        taskUUID = decodeUUID(props.match.params.task_uuid_b62) // everything before the query string
    }

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
    const statusBar = !tasks[listType.current][parentID.current] ? <></> :
        <StatusBar
            relayNext={tasks[listType.current][parentID.current].relay_next ? tasks[listType.current][parentID.current].relay_next.uuid : null}
            relayPrevious={tasks[listType.current][parentID.current].relay_previous ? tasks[listType.current][parentID.current].relay_previous.uuid : null}
            handleClose={handleClose}
            assignedRiders={tasks[listType.current][parentID.current].assigned_riders}
            assignedCoordinators={tasks[listType.current][parentID.current].assigned_coordinators}
            assignedCoordinatorsDisplayString={tasks[listType.current][parentID.current].assigned_coordinators_display_string}
            assignedRidersDisplayString={tasks[listType.current][parentID.current].assigned_riders_display_string}
            taskUUID={taskUUID}
        />

        if (tasks[listType.current][parentID.current]){
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
                    <Grid container direction={"row"} justify={"space-between"} alignItems={"center"}>
                        <Grid item>
                            <LocationDetailAndSelector label={"Pick up"}/>

                        </Grid>
                    </Grid>
                </Dialog>
            )
        }

}

export default TaskDialogCompact;
