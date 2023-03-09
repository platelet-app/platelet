import React from "react";
import { Chip, Grid } from "@mui/material";

export enum Days {
    ONE_DAY = 1,
    THREE_DAYS = 3,
    FIVE_DAYS = 5,
    ONE_WEEK = 7,
    TWO_WEEKS = 14,
}

export const dayOptions = {
    "1 day": Days.ONE_DAY,
    "3 days": Days.THREE_DAYS,
    "5 days": Days.FIVE_DAYS,
    "One week": Days.ONE_WEEK,
    "Two weeks": Days.TWO_WEEKS,
};

type DaysSelectionProps = {
    onChange: (arg0: Days) => any;
    value?: Days | null;
};

const DaysSelection: React.FC<DaysSelectionProps> = ({ onChange, value }) => {
    return (
        <Grid container direction="row" spacing={1}>
            {Object.entries(dayOptions).map(([label, day]) => (
                <Grid item key={day}>
                    <Chip
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
