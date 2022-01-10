import { FormControl, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

import { deliverableUnits } from "../apiConsts";

function UnitSelector(props) {
    return (
        <FormControl fullWidth>
            <Select
                id="deliverable-units"
                variant={"standard"}
                value={props.value}
                label={props.label}
                onChange={props.onChange}
            >
                {Object.values(deliverableUnits).map((unit) => (
                    <MenuItem key={unit} value={unit}>
                        {unit}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
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
