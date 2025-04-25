import * as React from "react";
import { Chip, Box, TextField, Stack } from "@mui/material";
import { DatePicker } from "@mui/lab";
import { ScheduledDatePickerOption } from "./PickUpAndDeliverSchedule";

type ScheduledDatePickerProps = {
    onSelectOption: (selection: ScheduledDatePickerOption) => void;
    option: ScheduledDatePickerOption | null;
    onSelectCustomDate: (date: Date | null) => void;
    customDate?: Date | null;
};

const ScheduledDatePicker: React.FC<ScheduledDatePickerProps> = ({
    onSelectOption,
    option,
    onSelectCustomDate,
    customDate,
}) => {
    const isToday = option === ScheduledDatePickerOption.TODAY;
    const isTomorrow = option === ScheduledDatePickerOption.TOMORROW;
    const isCustom = option === ScheduledDatePickerOption.CUSTOM;

    const handleSetToday = () => {
        onSelectOption(ScheduledDatePickerOption.TODAY);
    };

    const handleSetTomorrow = () => {
        onSelectOption(ScheduledDatePickerOption.TOMORROW);
    };

    const handleSetCustom = () => {
        onSelectOption(ScheduledDatePickerOption.CUSTOM);
    };

    return (
        <Stack spacing={1}>
            <Box sx={{ display: "flex", direction: "row", gap: 1 }}>
                <Chip
                    variant={isToday ? "filled" : "outlined"}
                    label="Today"
                    onClick={handleSetToday}
                    color={isToday ? "primary" : "default"}
                />
                <Chip
                    variant={isTomorrow ? "filled" : "outlined"}
                    label="Tomorrow"
                    onClick={handleSetTomorrow}
                    color={isTomorrow ? "primary" : "default"}
                />
                <Chip
                    variant={isCustom ? "filled" : "outlined"}
                    color={isCustom ? "primary" : "default"}
                    label="Custom"
                    onClick={handleSetCustom}
                />
            </Box>
            {isCustom && (
                <DatePicker
                    inputFormat={"dd/MM/yyyy"}
                    disablePast
                    value={customDate}
                    onChange={onSelectCustomDate}
                    renderInput={(params) => <TextField {...params} />}
                />
            )}
        </Stack>
    );
};

export default ScheduledDatePicker;
