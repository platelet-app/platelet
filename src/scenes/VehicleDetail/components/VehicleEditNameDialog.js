import React, { useState } from "react";
import PropTypes from "prop-types";
import { vehicleNameFields } from "./VehicleProfile";
import { Stack, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";

function VehicleEditNameDialog({ values, onChange }) {
    const [state, setState] = useState({ ...values });
    const theme = useTheme();

    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Stack sx={{ width: "100%", minWidth: isSm ? 0 : 400 }} spacing={1}>
            {Object.entries(vehicleNameFields).map(([key, label]) => {
                return (
                    <TextField
                        key={key}
                        fullWidth
                        inputProps={{
                            "aria-label": label,
                        }}
                        label={label}
                        margin="normal"
                        value={state[key]}
                        onChange={(e) => {
                            const { value } = e.target;
                            onChange({ ...state, [key]: value });
                            setState((prevState) => ({
                                ...prevState,
                                [key]: value,
                            }));
                        }}
                    />
                );
            })}
        </Stack>
    );
}

VehicleEditNameDialog.propTypes = {
    values: PropTypes.object,
    onChange: PropTypes.func,
};

VehicleEditNameDialog.defaultProps = {
    values: {},
    onChange: () => {},
};

export default VehicleEditNameDialog;
