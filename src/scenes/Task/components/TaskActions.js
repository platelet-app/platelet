import {
    Divider,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { dialogCardStyles } from "../styles/DialogCompactStyles";

const fields = {
    pickedUp: "Picked up",
    droppedOff: "Delivered",
    cancelled: "Cancelled",
    rejected: "Rejected",
};

function TaskActions(props) {
    const [state, setState] = useState([]);
    const cardClasses = dialogCardStyles();

    function onChange(key) {
        const value = state.includes(key) ? null : new Date().toISOString();
        if (key === "pickedUp") props.onChangeTimePickedUp(value);
        else if (key === "droppedOff") props.onChangeTimeDroppedOff(value);
        else if (key === "cancelled") props.onChangeTimeCancelled(value);
        else if (key === "rejected") props.onChangeTimeRejected(value);
        setState((prevState) => {
            if (prevState.includes(key))
                return prevState.filter((v) => v !== key);
            else return [...prevState, key];
        });
    }

    function updateStateFromProps() {
        if (!props.task) return;
        const result = [];
        if (!!props.task.timePickedUp) result.push("pickedUp");
        if (!!props.task.timeDroppedOff) result.push("droppedOff");
        if (!!props.task.timeRejected) result.push("rejected");
        if (!!props.task.timeCancelled) result.push("cancelled");
        setState(result);
    }

    function checkDisabled(key) {
        const stopped =
            state.includes("cancelled") || state.includes("rejected");
        if (key === "droppedOff") return !state.includes("pickedUp") || stopped;
        else if (key === "pickedUp")
            return state.includes("droppedOff") || stopped;
        else if (key === "rejected" || key === "cancelled")
            return state.includes("pickedUp") && state.includes("droppedOff");
        else return false;
    }

    useEffect(updateStateFromProps, [props.task]);
    return (
        <Paper className={cardClasses.root}>
            <Stack direction={"column"} spacing={2}>
                <Typography variant={"h6"}> Actions</Typography>
                <Divider />
                <ToggleButtonGroup
                    value={state}
                    onChange={props.onChange}
                    orientation="vertical"
                    aria-label="text formatting"
                >
                    {Object.entries(fields).map(([key, value]) => {
                        return (
                            <ToggleButton
                                disabled={
                                    props.isFetching || checkDisabled(key)
                                }
                                aria-label={key}
                                value={key}
                                onClick={() => onChange(key)}
                            >
                                {value}
                            </ToggleButton>
                        );
                    })}
                </ToggleButtonGroup>
            </Stack>
        </Paper>
    );
}

TaskActions.propTypes = {
    task: PropTypes.object,
    isFetching: PropTypes.bool,
    onChangeTimeRejected: PropTypes.func,
    onChangeTimeCancelled: PropTypes.func,
    onChangeTimePickedUp: PropTypes.func,
    onChangeTimeDroppedOff: PropTypes.func,
};

TaskActions.defaultProps = {
    isFetching: false,
    onChangeTimeRejected: () => {},
    onChangeTimeCancelled: () => {},
    onChangeTimePickedUp: () => {},
    onChangeTimeDroppedOff: () => {},
};

export default TaskActions;
