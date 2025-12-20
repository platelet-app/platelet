import React from "react";
import { Grid, TextField, MenuItem } from "@mui/material";

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
        if (newValue >= 0 || event.target.value === "") {
            onChange({
                ...value,
                value: newValue || 0,
            });
        }
    };

    const handleUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...value,
            unit: event.target.value as TimeUnit,
        });
    };

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="Retention Time"
                    type="number"
                    value={value.value}
                    onChange={handleValueChange}
                    disabled={disabled}
                    inputProps={{
                        min: 0,
                    }}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    select
                    label="Unit"
                    value={value.unit}
                    onChange={handleUnitChange}
                    disabled={disabled}
                >
                    <MenuItem value={TimeUnit.DAYS}>Days</MenuItem>
                    <MenuItem value={TimeUnit.WEEKS}>Weeks</MenuItem>
                    <MenuItem value={TimeUnit.MONTHS}>Months</MenuItem>
                    <MenuItem value={TimeUnit.YEARS}>Years</MenuItem>
                </TextField>
            </Grid>
        </Grid>
    );
};

export default DataRetentionSelector;
