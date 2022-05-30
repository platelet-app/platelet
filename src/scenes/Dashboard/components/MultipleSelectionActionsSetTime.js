import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Divider, Stack, TextField } from "@mui/material";
import * as models from "../../../models";
import { DateTimePicker } from "@mui/lab";
import { determineTaskStatus } from "../../../utilities";

function MultipleSelectionActionsSetTime({ selectedItems, timeKey, onChange }) {
    const [time, setTime] = React.useState(new Date());

    function handleTimeChange(value) {
        setTime(value);
    }

    async function generatedModels() {
        if (!selectedItems || !timeKey) return;
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
};

MultipleSelectionActionsSetTime.defaultProps = {
    selectedItems: [],
    onChange: () => {},
};

export default MultipleSelectionActionsSetTime;
