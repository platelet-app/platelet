import React from "react";
import { Stack, TextField, MenuItem } from "@mui/material";

export enum TimeUnit {
    DAYS = "days",
    WEEKS = "weeks",
    MONTHS = "months",
    YEARS = "years",
}

export type DataRetentionValue = {
    value: number;
    unit: TimeUnit;
};

type DataRetentionSelectorProps = {
    value: DataRetentionValue;
    onChange: (value: DataRetentionValue) => void;
    disabled?: boolean;
};

const DataRetentionSelector: React.FC<DataRetentionSelectorProps> = ({
    value,
    onChange,
    disabled = false,
}) => {
    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value, 10);
        if (isNaN(newValue) && event.target.value !== "") {
            return;
        }
        onChange({
            ...value,
            value: isNaN(newValue) ? 1 : Math.max(1, newValue),
        });
    };

    const handleUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...value,
            unit: event.target.value as TimeUnit,
        });
    };

    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <TextField
                label="Retention Time"
                type="number"
                value={value.value}
                onChange={handleValueChange}
                disabled={disabled}
                inputProps={{
                    min: 1,
                }}
                sx={{ flex: 1 }}
            />
            <TextField
                select
                label="Unit"
                value={value.unit}
                onChange={handleUnitChange}
                disabled={disabled}
                sx={{ flex: 1 }}
            >
                <MenuItem value={TimeUnit.DAYS}>Days</MenuItem>
                <MenuItem value={TimeUnit.WEEKS}>Weeks</MenuItem>
                <MenuItem value={TimeUnit.MONTHS}>Months</MenuItem>
                <MenuItem value={TimeUnit.YEARS}>Years</MenuItem>
            </TextField>
        </Stack>
    );
};

export default DataRetentionSelector;
