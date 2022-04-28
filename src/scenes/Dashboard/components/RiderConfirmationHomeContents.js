import React, { useEffect } from "react";
import ActiveRiderStats from "./ActiveRiderStats";
import PropTypes from "prop-types";
import {
    FormControlLabel,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/lab";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { tasksStatus, userRoles } from "../../../apiConsts";
import GetError from "../../../ErrorComponents/GetError";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

function RiderConfirmationHomeContents({
    userId,
    onChangeTimeHome,
    onClose,
    onSelect,
}) {
    const [fixedTime, setFixedTime] = React.useState(true);
    const [time, setTime] = React.useState(null);

    const [state, setState] = React.useState({
        droppedOff: 0,
        notDroppedOff: 0,
    });
    const [errorState, setErrorState] = React.useState(null);
    const [rider, setRider] = React.useState({ displayName: "" });

    useEffect(() => onChangeTimeHome(time), [time, onChangeTimeHome]);

    async function getRiderStats() {
        try {
            if (!userId) {
                setRider({ displayName: "" });
                return;
            }
            const rider = await DataStore.query(models.User, userId);
            if (!rider) {
                throw new Error("Rider not found");
            }
            setRider(rider);
            const riderTasks = (
                await DataStore.query(models.TaskAssignee, (a) =>
                    a.role("eq", userRoles.rider)
                )
            )
                .filter((a) => a.assignee && a.assignee.id === userId)
                .map((a) => a.task);
            const droppedOff = riderTasks.filter(
                (t) => t && t.status === tasksStatus.droppedOff
            ).length;
            const notDroppedOff = riderTasks.filter(
                (t) =>
                    t &&
                    ![
                        tasksStatus.droppedOff,
                        tasksStatus.completed,
                        tasksStatus.rejected,
                        tasksStatus.cancelled,
                    ].includes(t.status)
            ).length;
            if (droppedOff > 0) setTime(new Date());
            setState({ droppedOff, notDroppedOff });
        } catch (error) {
            console.log(error);
            setErrorState(error);
        }
    }
    useEffect(() => getRiderStats(), [userId]);
    if (errorState) {
        return <GetError />;
    }

    function toggleEditMode(e) {
        setFixedTime(e.target.checked);
        if (e.target.checked) {
            onChangeTimeHome(new Date());
        }
    }
    function handleTimeChange(value) {
        setTime(value);
    }
    return (
        <ConfirmationDialog
            onClose={onClose}
            onCancel={onClose}
            hideCancel={state.droppedOff === 0}
            onConfirmation={() => {
                if (state.droppedOff > 0) onSelect();
                onClose();
            }}
            open={!!userId}
        >
            <Stack direction="column" spacing={1}>
                <ActiveRiderStats
                    droppedOff={state.droppedOff}
                    active={state.notDroppedOff}
                    displayName={rider.displayName}
                />
                {state.droppedOff > 0 && (
                    <>
                        <Typography>Are they home?</Typography>
                        <DateTimePicker
                            label={"Rider home time"}
                            disabled={fixedTime}
                            value={time}
                            inputFormat={"dd/MM/yyyy HH:mm"}
                            openTo="hours"
                            onChange={handleTimeChange}
                            renderInput={(params) => (
                                <TextField
                                    variant={"standard"}
                                    fullWidth
                                    {...params}
                                />
                            )}
                        />
                        <FormControlLabel
                            value="edit"
                            control={
                                <Switch
                                    color="primary"
                                    checked={fixedTime}
                                    onChange={toggleEditMode}
                                />
                            }
                            label="Use current time?"
                            labelPlacement="start"
                        />
                    </>
                )}
            </Stack>
        </ConfirmationDialog>
    );
}

RiderConfirmationHomeContents.propTypes = {
    userId: PropTypes.string.isRequired,
    onChangeTimeHome: PropTypes.func,
};

RiderConfirmationHomeContents.defaultProps = {
    onChangeTimeHome: () => {},
};

export default RiderConfirmationHomeContents;
