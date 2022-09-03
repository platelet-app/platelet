import React from "react";
import PropTypes from "prop-types";
import { Chip, Grid } from "@mui/material";

const days = {
    1: "1 day",
    3: "3 days",
    5: "5 days",
    7: "One week",
    14: "Two weeks",
};

function DaysSelection({ onChange, value }) {
    return (
        <Grid container direction="row" spacing={1}>
            {Object.entries(days).map(([key, label]) => (
                <Grid item key={key}>
                    <Chip
                        label={label}
                        variant={value === key ? "default" : "outlined"}
                        color={value === key ? "primary" : "default"}
                        onClick={() => onChange(key)}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

DaysSelection.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
};

DaysSelection.defaultProps = {
    value: "1",
};

export default DaysSelection;
