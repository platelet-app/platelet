import React from "react";
import { FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { DateTimePicker } from "@mui/lab";

function TaskActionConfirmationDialogContents(props) {
    const [fixedTime, setFixedTime] = React.useState(true);
    const [time, setTime] = React.useState(new Date());
    function toggleEditMode(e) {
        setFixedTime(e.target.checked);
        if (e.target.checked) {
            props.onChange(new Date());
        }
    }

    function handleTimeChange(value) {
        setTime(value);
        props.onChange(value);
    }

    return (
        <Stack direction={"column"} spacing={1}>
            {!props.nullify && (
                <>
                    <DateTimePicker
                        label={props.label}
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
    );
}

TaskActionConfirmationDialogContents.propTypes = {
    field: PropTypes.oneOf([
        "timePickedUp",
        "timeDroppedOff",
        "timeRejected",
        "timeCancelled",
    ]).isRequired,
    nullify: PropTypes.bool.isRequired,
};

export default TaskActionConfirmationDialogContents;
