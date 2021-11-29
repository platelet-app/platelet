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
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import GetError from "../../../ErrorComponents/GetError";
import { useSelector } from "react-redux";
import { dataStoreReadyStatusSelector } from "../../../redux/Selectors";

const fields = {
    pickedUp: "Picked up",
    droppedOff: "Delivered",
    cancelled: "Cancelled",
    rejected: "Rejected",
};

function TaskActions(props) {
    const [state, setState] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [errorState, setErrorState] = useState(null);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const cardClasses = dialogCardStyles();

    function onChange(key) {
        const value = state.includes(key) ? null : new Date();
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

    async function updateStateFromTask() {
        if (!dataStoreReadyStatus) return;
        try {
            const task = await DataStore.query(models.Task, props.taskId);
            if (!task) throw new Error("Task not found");
            const result = [];
            if (task.timePickedUp) result.push("pickedUp");
            if (task.timeDroppedOff) result.push("droppedOff");
            if (task.timeRejected) result.push("rejected");
            if (task.timeCancelled) result.push("cancelled");
            setState(result);
            setIsFetching(false);
        } catch (e) {
            setIsFetching(false);
            console.log(e);
            setErrorState(e);
        }
    }

    useEffect(
        () => updateStateFromTask(),
        [props.taskId, dataStoreReadyStatus]
    );

    function checkDisabled(key) {
        const stopped =
            state.includes("cancelled") || state.includes("rejected");
        if (key === "droppedOff") return !state.includes("pickedUp") || stopped;
        else if (key === "pickedUp")
            return state.includes("droppedOff") || stopped;
        else if (key === "rejected") {
            if (state.includes("rejected")) return false;
            return (
                (state.includes("pickedUp") && state.includes("droppedOff")) ||
                stopped
            );
        } else if (key === "cancelled") {
            if (state.includes("cancelled")) return false;
            return (
                (state.includes("pickedUp") && state.includes("droppedOff")) ||
                stopped
            );
        } else return false;
    }

    if (errorState) {
        return <GetError />;
    } else {
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
                                    key={key}
                                    disabled={isFetching || checkDisabled(key)}
                                    aria-disabled={
                                        isFetching || checkDisabled(key)
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
