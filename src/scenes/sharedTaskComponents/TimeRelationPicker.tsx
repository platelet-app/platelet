import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import * as models from "../../models";
import { Stack, Typography } from "@mui/material";
import TimePickerBasic from "./TimePickerBasic";
import { calculateBetweenIsOneDay } from "../../utilities/calculateBetweenIsOneDay";

type TimeRelationPickerProps = {
    relation: models.TimeRelation;
    timePrimary: string;
    timeSecondary?: string | null;
    isValid: boolean;
    isValidSecondary?: boolean;
    handleChange: (event: models.TimeRelation) => void;
    handleChangeTime: (time: string) => void;
    handleChangeSecondaryTime: (time: string) => void;
    showOnlyTodayTimes?: boolean;
};

const TimeRelationPicker: React.FC<TimeRelationPickerProps> = ({
    relation,
    timePrimary,
    timeSecondary,
    isValid,
    isValidSecondary,
    handleChange,
    handleChangeTime,
    handleChangeSecondaryTime,
    showOnlyTodayTimes = false,
}) => {
    const { ANYTIME, BEFORE, AFTER, AT, BETWEEN } = models.TimeRelation;

    const betweenIsNextDay = calculateBetweenIsOneDay(
        timePrimary,
        timeSecondary
    );

    return (
        <Stack spacing={1} direction="row" alignItems="center">
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
                    value={timePrimary}
                    showOnlyTodayTimes={showOnlyTodayTimes}
                    label="Time"
                />
            )}
            {relation === models.TimeRelation.BETWEEN && (
                <Typography>-</Typography>
            )}
            {relation === models.TimeRelation.BETWEEN && timeSecondary && (
                <TimePickerBasic
                    isValid={isValidSecondary}
                    showPlusOneDay={betweenIsNextDay}
                    onChange={handleChangeSecondaryTime}
                    value={timeSecondary}
                    startValue={timePrimary}
                    label="End time"
                />
            )}
        </Stack>
    );
};

export default TimeRelationPicker;
