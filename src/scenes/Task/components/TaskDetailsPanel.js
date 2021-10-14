import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import LabelItemPair from "../../../components/LabelItemPair";
import Grid from "@material-ui/core/Grid";
import PrioritySelect from "./PrioritySelect";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ClickableTextField from "../../../components/ClickableTextField";
import TimePicker from "./TimePicker";
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

function extractTaskData(task) {
    let {
        reference,
        timeOfCall,
        riderResponsibility,
        id,
        requesterContact,
        priority,
        timeRejected,
        timeCancelled,
        timePickedUp,
        timeDroppedOff,
    } = task;
    if (requesterContact === null) {
        requesterContact = {
            name: null,
            telephoneNumber: null,
        };
    }
    return {
        reference,
        timeOfCall,
        riderResponsibility,
        id,
        requesterContact,
        priority,
        timeRejected,
        timeCancelled,
        timePickedUp,
        timeDroppedOff,
    };
}

function TaskDetailsPanel(props) {
    const cardClasses = dialogCardStyles();
    const [state, setState] = useState({
        reference: null,
        timeOfCall: null,
        timeCancelled: null,
        timeDroppedOff: null,
        timePickedUp: null,
        priority: null,
        timeRejected: null,
        riderResponsibility: null,
        id: null,
        requesterContact: {
            name: null,
            telephoneNumber: null,
        },
    });
    const classes = useStyles();

    useEffect(() => setState(extractTaskData(props.task)), [props.task]);

    function onChangeTimeOfCall(value) {
        if (value) {
            props.onChangeTimeOfCall(value);
        }
    }

    function onChangeTimeCancelled(value) {
        if (value || value === null) {
            props.onChangeTimeCancelled(value);
        }
    }
    function onChangeTimePickedUp(value) {
        if (value || value === null) {
            props.onChangeTimePickedUp(value);
        }
    }
    function onChangeTimeDroppedOff(value) {
        if (value || value === null) {
            props.onChangeTimeDroppedOff(value);
        }
    }

    function onChangeTimeRejected(value) {
        if (value || value === null) {
            props.onChangeTimeRejected(value);
        }
    }

    function onSelectPriority(priority) {
        props.onSelectPriority(priority);
    }

    function onChangeRequesterContact(value) {
        props.onChangeRequesterContact(value);
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
                            label={"TOC"}
                            time={state.timeOfCall}
                        />
                    </LabelItemPair>
                    <Typography>Requester contact:</Typography>
                    <div className={classes.requesterContact}>
                        <LabelItemPair label={"Name"}>
                            <ClickableTextField
                                onFinished={(value) =>
                                    onChangeRequesterContact({
                                        name: value,
                                    })
                                }
                                value={
                                    state.requesterContact
                                        ? state.requesterContact.name
                                        : null
                                }
                            />
                        </LabelItemPair>
                        <LabelItemPair label={"Tel"}>
                            <ClickableTextField
                                tel
                                onFinished={(value) =>
                                    onChangeRequesterContact({
                                        telephoneNumber: value,
                                    })
                                }
                                value={
                                    state.requesterContact
                                        ? state.requesterContact.telephoneNumber
                                        : null
                                }
                            />
                        </LabelItemPair>
                    </div>
                    <Typography>Priority:</Typography>
                    <div className={classes.priority}>
                        <PrioritySelect
                            onSelect={onSelectPriority}
                            priority={state.priority}
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
                    <Grid container spacing={1} direction={"column"}>
                        <Grid item>
                            <LabelItemPair label={"Time picked up"}>
                                <TimePicker
                                    onChange={onChangeTimePickedUp}
                                    label={"Mark picked up"}
                                    time={state.timePickedUp}
                                />
                            </LabelItemPair>
                        </Grid>
                        <Grid item>
                            <LabelItemPair label={"Time delivered"}>
                                <TimePicker
                                    onChange={onChangeTimeDroppedOff}
                                    disabled={props.disableTimeButton}
                                    label={"Mark delivered"}
                                    time={state.timeDroppedOff}
                                />
                            </LabelItemPair>
                        </Grid>
                        <Grid item>
                            <LabelItemPair label={"Time cancelled"}>
                                <TimePicker
                                    onChange={onChangeTimeCancelled}
                                    disabled={
                                        !!state.timeDroppedOff ||
                                        !!state.timeRejected
                                    }
                                    label={"Mark cancelled"}
                                    time={state.timeCancelled}
                                />
                            </LabelItemPair>
                        </Grid>
                        <Grid item>
                            <LabelItemPair label={"Time rejected"}>
                                <TimePicker
                                    onChange={onChangeTimeRejected}
                                    disabled={
                                        !!state.timeDroppedOff ||
                                        !!state.timeCancelled
                                    }
                                    label={"Mark rejected"}
                                    time={state.timeRejected}
                                />
                            </LabelItemPair>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}

TaskDetailsPanel.propTypes = {
    task: PropTypes.object,
    onChangeTimeRejected: PropTypes.func,
    onChangeTimeCancelled: PropTypes.func,
    onSelectPriority: PropTypes.func,
    onChangeRequesterContact: PropTypes.func,
};

TaskDetailsPanel.defaultProps = {
    onChangeTimeRejected: () => {},
    onChangeTimeCancelled: () => {},
    onSelectPriority: () => {},
    onChangeRequesterContact: () => {},
};

export default TaskDetailsPanel;
