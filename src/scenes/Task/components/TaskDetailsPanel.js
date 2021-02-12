import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import LabelItemPair from "../../../components/LabelItemPair";
import PropTypes from "prop-types"
import Grid from "@material-ui/core/Grid";
import PrioritySelect from "./PrioritySelect";
import {
    updateTaskPriorityRequest,
    updateTaskRequesterContactRequest,
    updateTaskTimeOfCallRequest
} from "../../../redux/tasks/TasksActions";
import {useDispatch, useSelector} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ClickableTextField from "../../../components/ClickableTextField";
import ActivityPopover from "./ActivityPopover";
import {PaddedPaper} from "../../../styles/common";
import TimePicker from "./TimePicker";

const useStyles = makeStyles({
    requesterContact: {
        paddingLeft: "20px"
    }
})

function TaskDetailsPanel(props) {
    const task = useSelector(state => state.task.task);
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
        <Grid container spacing={3}>
            <Grid item>
                <LabelItemPair label={"Reference"}>
                    <Typography>{state.reference}</Typography>
                </LabelItemPair>
                <LabelItemPair label={"TOC"}>
                    <TimePicker
                        onChange={onChangeTimeOfCall}
                        disableClear={true}
                        disabled={false}
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
                <LabelItemPair label={"Priority"}>
                    <PrioritySelect onSelect={onSelectPriority} priorityID={parseInt(priority_id)}/>
                </LabelItemPair>
                <LabelItemPair label={"Patch"}>
                    <Typography>{state.patch}</Typography>
                </LabelItemPair>
                <LabelItemPair label={"Assigned rider"}>
                    <Typography>{state.assigned_riders_display_string}</Typography>
                </LabelItemPair>
                <ActivityPopover parentUUID={task.uuid}/>
            </Grid>
            <Grid item>

            </Grid>
        </Grid>
    )
}

export default TaskDetailsPanel;
