import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import * as models from "../../models";
import { Stack } from "@mui/material";
import TimePickerBasic from "./TimePickerBasic";

type TimeRelationPickerProps = {
    relation: models.TimeRelation;
    time: string;
    isValid: boolean;
    handleChange: (event: models.TimeRelation) => void;
    handleChangeTime: (time: string) => void;
    showOnlyTodayTimes?: boolean;
};

const TimeRelationPicker: React.FC<TimeRelationPickerProps> = ({
    relation,
    time,
    isValid,
    handleChange,
    handleChangeTime,
    showOnlyTodayTimes = false,
}) => {
    const { ANYTIME, BEFORE, AFTER, AT, BETWEEN } = models.TimeRelation;

    return (
        <Stack spacing={1} direction="row">
            <FormControl fullWidth>
                <Select
                    value={relation}
                    onChange={(event) =>
                        handleChange(event.target.value as models.TimeRelation)
                    }
                >
                    <MenuItem value={ANYTIME}>{ANYTIME}</MenuItem>
                    <MenuItem value={BEFORE}>{BEFORE}</MenuItem>
                    <MenuItem value={AT}>{AT}</MenuItem>
                    <MenuItem value={AFTER}>{AFTER}</MenuItem>
                    <MenuItem value={BETWEEN}>{BETWEEN}</MenuItem>
                </Select>
            </FormControl>
            {relation !== models.TimeRelation.ANYTIME && (
                <TimePickerBasic
                    isValid={isValid}
                    onChange={handleChangeTime}
                    value={time}
                    showOnlyTodayTimes={showOnlyTodayTimes}
                />
            )}
        </Stack>
    );
};

export default TimeRelationPicker;
