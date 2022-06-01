import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Divider, Stack, TextField } from "@mui/material";
import * as models from "../../../models";
import { DateTimePicker } from "@mui/lab";
import { determineTaskStatus } from "../../../utilities";

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

function MultipleSelectionActionsSetTime({
    selectedItems,
    timeKey,
    onChange,
    onReady,
}) {
    const [time, setTime] = React.useState(new Date());
    const [isValid, setIsValid] = React.useState(true);

    function handleTimeChange(value) {
        if (!isValidDate(value)) {
            onReady(false);
            setIsValid(false);
            setTime(value);
            return;
        }
        setIsValid(true);
        setTime(value);
    }

    async function generatedModels() {
        if (!selectedItems || !timeKey || !isValid) return;
        onReady(false);
        const newModels = await Promise.all(
            Object.values(selectedItems).map(async (item) => {
                const status = await determineTaskStatus({
                    ...item,
                    [timeKey]: time,
                });
                return models.Task.copyOf(item, (updated) => {
                    updated[timeKey] = time.toISOString();
                    updated.status = status;
                });
            })
        );
        onChange(newModels);
        onReady(true);
    }
    useEffect(
        () => generatedModels(),
        [time, timeKey, selectedItems, onChange]
    );
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
