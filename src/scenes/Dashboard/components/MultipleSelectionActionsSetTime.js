import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Divider, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/lab";

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

function MultipleSelectionActionsSetTime({ onChange }) {
    const [time, setTime] = React.useState(new Date());

    function handleTimeChange(value) {
        setTime(value);
    }

    useEffect(() => {
        if (!isValidDate(time)) onChange(null);
        else onChange(time);
    }, [onChange, time]);

    return (
        <DateTimePicker
            value={time}
            inputFormat={"dd/MM/yyyy HH:mm"}
            openTo="hours"
            onChange={handleTimeChange}
            renderInput={(params) => (
                <TextField variant={"standard"} fullWidth {...params} />
            )}
        />
    );
}

MultipleSelectionActionsSetTime.propTypes = {
    onChange: PropTypes.func,
};

MultipleSelectionActionsSetTime.defaultProps = {
    onChange: () => {},
};

export default MultipleSelectionActionsSetTime;
