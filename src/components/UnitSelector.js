import { Grid, Chip } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

import { deliverableUnits } from "../apiConsts";

function UnitSelector(props) {
    return (
        <Grid container direction="row" spacing={1}>
            {Object.values(deliverableUnits).map((unit) => (
                <Grid item key={unit}>
                    <Chip
                        onClick={() => props.onChange(unit)}
                        variant={props.value === unit ? "default" : "outlined"}
                        color={props.value === unit ? "primary" : "default"}
                        label={unit}
                        value={unit}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

UnitSelector.defaultProps = {
    value: PropTypes.string,
    label: PropTypes.string,
};

UnitSelector.defaultProps = {
    value: null,
    label: "Unit",
};

export default UnitSelector;
