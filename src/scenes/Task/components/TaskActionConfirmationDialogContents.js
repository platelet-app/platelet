import React from "react";
import { FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { DateTimePicker } from "@mui/lab";

function TaskActionConfirmationDialogContents(props) {
    const [time, setTime] = React.useState(new Date());

    function handleTimeChange(value) {
        setTime(value);
        props.onChange(value);
    }

    return (
        <>
            {!props.nullify && (
                <DateTimePicker
                    label={props.label}
                    value={time}
                    inputFormat={"dd/MM/yyyy HH:mm"}
                    openTo="hours"
                    onChange={handleTimeChange}
                    renderInput={(params) => (
                        <TextField variant={"standard"} fullWidth {...params} />
                    )}
                />
            )}
        </>
    );
}

TaskActionConfirmationDialogContents.propTypes = {
    field: PropTypes.oneOf([
        "timePickedUp",
        "timeDroppedOff",
        "timeRejected",
        "timeCancelled",
        "timeRiderHome",
    ]).isRequired,
    nullify: PropTypes.bool.isRequired,
};

export default TaskActionConfirmationDialogContents;
