import React from "react";
import { Chip, Grid } from "@mui/material";

export enum Days {
    ONE_DAY = 1,
    THREE_DAYS = 3,
    FIVE_DAYS = 5,
    ONE_WEEK = 7,
    TWO_WEEKS = 14,
    CUSTOM = 0,
}

type DayOptions = {
    "1 day": Days;
    "3 days": Days;
    "5 days": Days;
    "One week": Days;
    "Two weeks": Days;
    Custom?: Days;
};

export const dayOptions: DayOptions = {
    "1 day": Days.ONE_DAY,
    "3 days": Days.THREE_DAYS,
    "5 days": Days.FIVE_DAYS,
    "One week": Days.ONE_WEEK,
    "Two weeks": Days.TWO_WEEKS,
};

type DaysSelectionProps = {
    onChange: (arg0: Days) => any;
    value?: Days | null;
    size?: "small" | "medium";
    showCustom?: boolean;
    exclude?: Days[];
    disabled?: boolean;
};

const DaysSelection: React.FC<DaysSelectionProps> = ({
    onChange,
    value,
    size = "medium",
    showCustom = false,
    exclude = [],
    disabled = false,
}) => {
    let fields = { ...dayOptions };
    if (showCustom) {
        fields = { ...dayOptions, Custom: Days.CUSTOM };
    }
    const filtered = Object.entries(fields).reduce((acc, [label, day]) => {
        if (!exclude.includes(day)) {
            acc[label as keyof DayOptions] = day;
        }
        return acc;
    }, {} as DayOptions);

    return (
        <Grid container direction="row" spacing={1}>
            {Object.entries(filtered).map(([label, day]) => (
                <Grid item key={day}>
                    <Chip
                        disabled={disabled}
                        size={size}
                        aria-label={label}
                        label={label}
                        variant={value === day ? "filled" : "outlined"}
                        color={value === day ? "primary" : "default"}
                        onClick={() => onChange(day)}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default DaysSelection;
