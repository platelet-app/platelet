import React from "react";
import Grid from "@material-ui/core/Grid";
import LocationDetailAndSelector from "./components/LocationDetailAndSelector";
import StatusBar from "./components/StatusBar";
import Dialog from "@material-ui/core/Dialog";
import {useHistory, useLocation} from "react-router";
import {useSelector} from "react-redux";
import {decodeUUID} from "../../utilities";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function TaskDialogCompact(props) {
    const mobileView = useSelector(state => state.mobileView);
    const tasks = useSelector(state => state.tasks.tasks);
    const history = useHistory();
    const query = useQuery();

    let taskUUID = null;
    const listType = query.get("key");
    const taskParent = query.get("parent");
    let task = null;

    if (props.match) {
        taskUUID = decodeUUID(props.match.params.task_uuid_b62) // everything before the query string
    }

    if (taskParent && listType && taskUUID)
        task = tasks[listType][taskParent][taskUUID]


    let handleClose = e => {
        e.stopPropagation();
        if (props.location.state)
            history.goBack();
        else
            history.push("/");

    };
    const statusBar =
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

export default TaskDialogCompact;
