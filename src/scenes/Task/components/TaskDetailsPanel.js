import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import LabelItemPair from "../../../components/LabelItemPair";
import Grid from "@material-ui/core/Grid";
import PrioritySelect from "./PrioritySelect";
import {
    updateTaskPriorityRequest, updateTaskRejectedTimeRequest,
    updateTaskRequesterContactRequest,
    updateTaskTimeCancelledPrefix,
    updateTaskTimeCancelledRequest,
    updateTaskTimeOfCallPrefix,
    updateTaskTimeOfCallRequest
} from "../../../redux/tasks/TasksActions";
import {useDispatch, useSelector} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ClickableTextField from "../../../components/ClickableTextField";
import ActivityPopover from "./ActivityPopover";
import TimePicker from "./TimePicker";
import {createPostingSelector} from "../../../redux/selectors";

const useStyles = makeStyles({
    requesterContact: {
        paddingLeft: "20px"
    },
    priority: {
        paddingLeft: "20px"
    }
})

const tocPostingSelector = createPostingSelector([updateTaskTimeOfCallPrefix]);
const cancelledPostingSelector = createPostingSelector([updateTaskTimeCancelledPrefix]);
const rejectedPostingSelector = createPostingSelector(["UPDATE_TASK_TIME_REJECTED"]);

function TaskDetailsPanel(props) {
    const task = useSelector(state => state.task.task);
    const tocPosting = useSelector(state => tocPostingSelector(state));
    const isPostingCancelTime = useSelector(state => cancelledPostingSelector(state));
    const isPostingRejectedTime = useSelector(state => rejectedPostingSelector(state));
    const [state, setState] = useState({
        reference: null,
        time_of_call: null,
        patch: null,
        assigned_riders_display_string: "",
        uuid: null,
        requester_contact: {
            name: null,
            telephone_number: null
        }
    });
    const dispatch = useDispatch();
    const classes = useStyles();

    function setTaskData() {
        const {
            reference,
            time_of_call,
            patch,
            assigned_riders_display_string,
            uuid,
            requester_contact
        } = task;
        setState({reference, time_of_call, patch, assigned_riders_display_string, uuid, requester_contact})
    }
    useEffect(setTaskData, [task])

    let priority_id;
    try {
        priority_id = parseInt(task.priority_id)
    } catch {
        priority_id = null;
    }

    function onChangeTimeOfCall(value) {
        const payload = {time_of_call: value}
        dispatch(updateTaskTimeOfCallRequest(state.uuid, payload))
    }
    function onChangeTimeCancelled(value) {
        if (value || value === null)
            dispatch(updateTaskTimeCancelledRequest(task.uuid, {time_cancelled: value}))
    }
    function onChangeTimeRejected(value) {
        if (value || value === null)
            dispatch(updateTaskRejectedTimeRequest(task.uuid, {time_rejected: value}))
    }
    function onSelectPriority(priority_id, priority) {
        const payload = {priority_id, priority};
        dispatch(updateTaskPriorityRequest(state.uuid, payload));
    }

    function onChangeRequesterContact(value) {
        const result = {...state.requester_contact, ...value};
        setState({...state, requester_contact: result});
    }

    function sendRequesterContactData() {
        const payload = {requester_contact: state.requester_contact};
        dispatch(updateTaskRequesterContactRequest(state.uuid, payload));
    }

    return (
        <Grid container direction={"column"} spacing={3}>
            <Grid item>
                <LabelItemPair label={"Reference"}>
                    <Typography>{state.reference}</Typography>
                </LabelItemPair>
                <LabelItemPair label={"TOC"}>
                    <TimePicker
                        onChange={onChangeTimeOfCall}
                        disableClear={true}
                        disabled={tocPosting}
                        label={"TOC"}
                        time={state.time_of_call}/>
                </LabelItemPair>
                <Typography>Requester contact:</Typography>
                <div className={classes.requesterContact}>
                    <LabelItemPair label={"Name"}>
                        <ClickableTextField onFinished={sendRequesterContactData} onChange={v => onChangeRequesterContact({name: v})} value={state.requester_contact.name}/>
                    </LabelItemPair>
                    <LabelItemPair label={"Tel"}>
                        <ClickableTextField onFinished={sendRequesterContactData} telephone={true} onChange={v => onChangeRequesterContact({telephone_number: v})} value={state.requester_contact.telephone_number}/>
                    </LabelItemPair>
                </div>
                <Typography>Priority:</Typography>
                <div className={classes.priority}>
                    <PrioritySelect onSelect={onSelectPriority} priorityID={parseInt(priority_id)}/>
                </div>
                <LabelItemPair label={"Patch"}>
                    <Typography>{state.patch}</Typography>
                </LabelItemPair>
                <LabelItemPair label={"Assigned rider"}>
                    <Typography>{state.assigned_riders_display_string}</Typography>
                </LabelItemPair>
                <ActivityPopover parentUUID={task.uuid}/>
            </Grid>
            <Grid item>
                <Grid item>
                    <LabelItemPair label={"Time cancelled"}>
                        <TimePicker
                            onChange={onChangeTimeCancelled}
                            disabled={isPostingCancelTime || !!task.time_dropped_off || !!task.time_rejected}
                            label={"Mark cancelled"}
                            time={task.time_cancelled}/>
                    </LabelItemPair>
                </Grid>
                <Grid item>
                    <LabelItemPair label={"Time rejected"}>
                        <TimePicker
                            onChange={onChangeTimeRejected}
                            disabled={isPostingRejectedTime || !!task.time_dropped_off || !!task.time_cancelled}
                            label={"Mark rejected"}
                            time={task.time_rejected}/>
                    </LabelItemPair>
                </Grid>

            </Grid>
        </Grid>
    )
}

export default TaskDetailsPanel;
