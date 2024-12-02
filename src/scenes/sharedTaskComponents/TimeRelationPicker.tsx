import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as models from "../../models";
import { Stack } from "@mui/material";
import TimePickerBasic from "./TimePickerBasic";

const TimeRelationPicker = () => {
    const [relation, setRelation] = React.useState<models.TimeRelation>(
        models.TimeRelation.ANYTIME
    );
    const [time, setTime] = React.useState("10:00");

    const handleChange = (event: SelectChangeEvent) => {
        setRelation(event.target.value as models.TimeRelation);
    };

    const isValidTime = (time: string) => {
        const [hours, minutes] = time
            .split(":")
            .map((value) => parseInt(value));
        return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
    };

    const isValid = isValidTime(time);

    const handleChangeTime = (value: string) => {
        setTime(value);
    };

    return (
        <Stack spacing={1} direction="row" sx={{ minWidth: 340 }}>
            <FormControl fullWidth>
                <Select value={relation} onChange={handleChange}>
                    {Object.values(models.TimeRelation).map((timeRelation) => (
                        <MenuItem value={timeRelation}>{timeRelation}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {relation !== models.TimeRelation.ANYTIME && (
                <TimePickerBasic
                    isValid={isValid}
                    onChange={handleChangeTime}
                    value={time}
                />
            )}
        </Stack>
    );
};

export default TimeRelationPicker;
