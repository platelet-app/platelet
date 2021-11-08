import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import LabelItemPair from "../../../components/LabelItemPair";
import Grid from "@mui/material/Grid";
import PrioritySelect from "./PrioritySelect";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import ClickableTextField from "../../../components/ClickableTextField";
import TimePicker from "./TimePicker";
import { Paper, Skeleton, Stack } from "@mui/material";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import TaskActions from "./TaskActions";

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
        priority: null,
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

    function onSelectPriority(priority) {
        props.onSelectPriority(priority);
    }

    function onChangeRequesterContact(value) {
        props.onChangeRequesterContact(value);
    }
    if (props.isFetching) {
        return (
            <Paper className={cardClasses.root}>
                <Skeleton variant="rectangular" width="100%" height={200} />
            </Paper>
        );
    } else {
        return (
            <Paper className={cardClasses.root}>
                <Stack direction={"column"} spacing={1}>
                    <LabelItemPair label={"Reference"}>
                        <Typography>{state.reference}</Typography>
                    </LabelItemPair>
                    <LabelItemPair label={"Time of call"}>
                        <TimePicker
                            onChange={onChangeTimeOfCall}
                            disableClear={true}
                            label={"Time of call"}
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
                    <LabelItemPair label={"Responsibility"}>
                        <Typography>
                            {state.riderResponsibility
                                ? state.riderResponsibility.label
                                : ""}
                        </Typography>
                    </LabelItemPair>
                </Stack>
            </Paper>
        );
    }
}

TaskDetailsPanel.propTypes = {
    task: PropTypes.object,
    isFetching: PropTypes.bool,
    onSelectPriority: PropTypes.func,
    onChangeRequesterContact: PropTypes.func,
};

TaskDetailsPanel.defaultProps = {
    isFetching: false,
    onSelectPriority: () => {},
    onChangeRequesterContact: () => {},
};

export default TaskDetailsPanel;
