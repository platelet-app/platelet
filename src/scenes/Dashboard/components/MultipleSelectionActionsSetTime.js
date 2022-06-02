import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Divider, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/lab";

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

function MultipleSelectionActionsSetTime({ onChange, onReady }) {
    const [time, setTime] = React.useState(new Date());
    const [isValid, setIsValid] = React.useState(true);

    function handleTimeChange(value) {
        setTime(value);
    }

    useEffect(() => {
        if (!isValidDate(time)) onChange(null);
        else onChange(time);
    }, [isValid, onChange, time]);

    return (
        <Stack spacing={2} direction="column" divider={<Divider />}>
            <DateTimePicker
                value={time}
                inputFormat={"dd/MM/yyyy HH:mm"}
                openTo="hours"
                onChange={handleTimeChange}
                renderInput={(params) => (
                    <TextField variant={"standard"} fullWidth {...params} />
                )}
            />
        </Stack>
    );
}

MultipleSelectionActionsSetTime.propTypes = {
    selectedItems: PropTypes.object,
    timeKey: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onReady: PropTypes.func,
};

MultipleSelectionActionsSetTime.defaultProps = {
    selectedItems: [],
    onChange: () => {},
    onReady: () => {},
};

export default MultipleSelectionActionsSetTime;
