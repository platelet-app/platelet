import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import LabelItemPair from "../../../components/LabelItemPair";
import PropTypes from "prop-types"
import Grid from "@material-ui/core/Grid";
import PrioritySelect from "./PrioritySelect";
import {updateTaskPriorityRequest, updateTaskRequesterContactRequest} from "../../../redux/tasks/TasksActions";
import {useDispatch, useSelector} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ClickableTextField from "../../../components/ClickableTextField";
import ActivityPopover from "./ActivityPopover";
import {PaddedPaper} from "../../../styles/common";

const useStyles = makeStyles({
    requesterContact: {
        paddingLeft: "20px"
    }
})

function TaskDetailsPanel(props) {
    const task = useSelector(state => state.task.task);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {
        reference,
        time_of_call,
        patch,
        assigned_riders_display_string,
        uuid
    } = task;
    const {name, telephone_number} = task.requester_contact ? task.requester_contact : {name: "", telephone_number: ""}
    const [requesterContactValue, setRequesterContactValue] = useState({name, telephone_number})

    let priority_id;
    try {
        priority_id = parseInt(task.priority_id)
    } catch {
        priority_id = null;
    }

    function onSelectPriority(priority_id, priority) {
        const payload = {priority_id, priority};
        dispatch(updateTaskPriorityRequest(uuid, payload));
    }

    function onChangeRequesterContact(value) {
        const result = {...requesterContactValue, ...value};
        setRequesterContactValue(result);
        const payload = {requester_contact: result};
        dispatch(updateTaskRequesterContactRequest(uuid, payload));
    }


    return (
        <Grid container spacing={3}>
            <Grid item>
                <LabelItemPair label={"Reference"}>
                    <Typography>{reference}</Typography>
                </LabelItemPair>
                <LabelItemPair label={"TOC"}>
                    <Typography><Moment local calendar>{time_of_call}</Moment></Typography>
                </LabelItemPair>
                <Typography>Requester contact:</Typography>
                <div className={classes.requesterContact}>
                    <LabelItemPair label={"Name"}>
                        <ClickableTextField onChange={v => onChangeRequesterContact({name: v})} value={requesterContactValue.name}/>
                    </LabelItemPair>
                    <LabelItemPair label={"Tel"}>
                        <ClickableTextField telephone={true} onChange={v => onChangeRequesterContact({telephone_number: v})} value={requesterContactValue.telephone_number}/>
                    </LabelItemPair>
                </div>
                <LabelItemPair label={"Priority"}>
                    <PrioritySelect onSelect={onSelectPriority} priorityID={parseInt(priority_id)}/>
                </LabelItemPair>
                <LabelItemPair label={"Patch"}>
                    <Typography>{patch}</Typography>
                </LabelItemPair>
                <LabelItemPair label={"Assigned rider"}>
                    <Typography>{assigned_riders_display_string}</Typography>
                </LabelItemPair>
                <ActivityPopover parentUUID={task.uuid}/>
            </Grid>
            <Grid item>

            </Grid>
        </Grid>
    )
}

export default TaskDetailsPanel;
