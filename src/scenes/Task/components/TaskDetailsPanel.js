import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import LabelItemPair from "../../../components/LabelItemPair";
import Grid from "@material-ui/core/Grid";
import PrioritySelect from "./PrioritySelect";
import {
    updateTaskCancelledTimePrefix,
    updateTaskCancelledTimeRequest,
    updateTaskPriorityRequest,
    updateTaskRejectedTimeRequest,
    updateTaskRequesterContactRequest,
    updateTaskTimeOfCallPrefix,
    updateTaskTimeOfCallRequest,
} from "../../../redux/tasks/TasksActions";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ClickableTextField from "../../../components/ClickableTextField";
import ActivityPopover from "./ActivityPopover";
import TimePicker from "./TimePicker";
import { createPostingSelector } from "../../../redux/LoadingSelectors";
import { Paper } from "@material-ui/core";
import { dialogCardStyles } from "../styles/DialogCompactStyles";

const useStyles = makeStyles({
    requesterContact: {
        paddingLeft: "20px",
    },
    priority: {
        paddingLeft: "20px",
    },
});

const tocPostingSelector = createPostingSelector([updateTaskTimeOfCallPrefix]);
const cancelledPostingSelector = createPostingSelector([
    updateTaskCancelledTimePrefix,
]);
const rejectedPostingSelector = createPostingSelector([
    "UPDATE_TASK_TIME_REJECTED",
]);

function extractTaskData(task) {
    let {
        reference,
        time_of_call,
        patch,
        assigned_riders_display_string,
        uuid,
        requester_contact,
    } = task;
    if (requester_contact === null) {
        requester_contact = {
            name: null,
            telephone_number: null,
        };
    }
    return {
        reference,
        time_of_call,
        patch,
        assigned_riders_display_string,
        uuid,
        requester_contact,
    };
}

function TaskDetailsPanel() {
    const task = useSelector((state) => state.task.task);
    const tocPosting = useSelector((state) => tocPostingSelector(state));
    const isPostingCancelTime = useSelector((state) =>
        cancelledPostingSelector(state)
    );
    const isPostingRejectedTime = useSelector((state) =>
        rejectedPostingSelector(state)
    );
    const cardClasses = dialogCardStyles();
    const [state, setState] = useState({
        reference: null,
        time_of_call: null,
        patch: null,
        assigned_riders_display_string: "",
        uuid: null,
        requester_contact: {
            name: null,
            telephone_number: null,
        },
    });
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => setState(extractTaskData(task)), [task]);

    let priority_id;
    try {
        priority_id = parseInt(task.priority_id);
    } catch {
        priority_id = null;
    }

    function onChangeTimeOfCall(value) {
        const payload = { time_of_call: value };
        dispatch(updateTaskTimeOfCallRequest(state.uuid, payload));
    }

    function onChangeTimeCancelled(value) {
        if (value || value === null)
            dispatch(
                updateTaskCancelledTimeRequest(task.uuid, {
                    time_cancelled: value,
                })
            );
    }

    function onChangeTimeRejected(value) {
        if (value || value === null)
            dispatch(
                updateTaskRejectedTimeRequest(task.uuid, {
                    time_rejected: value,
                })
            );
    }

    function onSelectPriority(priority_id, priority) {
        const payload = { priority_id, priority };
        dispatch(updateTaskPriorityRequest(state.uuid, payload));
    }

    function onChangeRequesterContact(value) {
        const result = { ...state.requester_contact, ...value };
        setState({ ...state, requester_contact: result });
    }

    function sendRequesterContactData(value) {
        const payload = {
            requester_contact: { ...state.requester_contact, ...value },
        };
        dispatch(updateTaskRequesterContactRequest(state.uuid, payload));
        setState({ ...state, ...payload });
    }

    return (
        <Paper className={cardClasses.root}>
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
                            time={state.time_of_call}
                        />
                    </LabelItemPair>
                    <Typography>Requester contact:</Typography>
                    <div className={classes.requesterContact}>
                        <LabelItemPair label={"Name"}>
                            <ClickableTextField
                                onFinished={(value) =>
                                    sendRequesterContactData({
                                        name: value,
                                    })
                                }
                                value={state.requester_contact.name}
                            />
                        </LabelItemPair>
                        <LabelItemPair label={"Tel"}>
                            <ClickableTextField
                                tel
                                onFinished={(value) =>
                                    sendRequesterContactData({
                                        telephone_number: value,
                                    })
                                }
                                value={state.requester_contact.telephone_number}
                            />
                        </LabelItemPair>
                    </div>
                    <Typography>Priority:</Typography>
                    <div className={classes.priority}>
                        <PrioritySelect
                            onSelect={onSelectPriority}
                            priorityID={parseInt(priority_id)}
                        />
                    </div>
                    <LabelItemPair label={"Patch"}>
                        <Typography>{state.patch}</Typography>
                    </LabelItemPair>
                    <LabelItemPair label={"Assigned rider"}>
                        <Typography>
                            {state.assigned_riders_display_string}
                        </Typography>
                    </LabelItemPair>
                </Grid>
                <Grid item>
                    <Grid container direction={"column"}>
                        <Grid item>
                            <LabelItemPair label={""}>
                                <ActivityPopover parentUUID={task.uuid} />
                            </LabelItemPair>
                        </Grid>
                        <Grid item>
                            <LabelItemPair label={"Time cancelled"}>
                                <TimePicker
                                    onChange={onChangeTimeCancelled}
                                    disabled={
                                        isPostingCancelTime ||
                                        !!task.time_dropped_off ||
                                        !!task.time_rejected
                                    }
                                    label={"Mark cancelled"}
                                    time={task.time_cancelled}
                                />
                            </LabelItemPair>
                        </Grid>
                        <Grid item>
                            <LabelItemPair label={"Time rejected"}>
                                <TimePicker
                                    onChange={onChangeTimeRejected}
                                    disabled={
                                        isPostingRejectedTime ||
                                        !!task.time_dropped_off ||
                                        !!task.time_cancelled
                                    }
                                    label={"Mark rejected"}
                                    time={task.time_rejected}
                                />
                            </LabelItemPair>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default TaskDetailsPanel;
