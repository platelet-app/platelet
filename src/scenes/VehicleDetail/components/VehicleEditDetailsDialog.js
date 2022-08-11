import React, { useState } from "react";
import PropTypes from "prop-types";
import { vehicleDetailFields, vehicleDateFields } from "./VehicleProfile";
import { useTheme } from "@mui/styles";
import { Stack, TextField, useMediaQuery } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

function VehicleEditDetailsDialog({ values, onChange }) {
    const [state, setState] = useState({
        ...values,
    });
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    const handleChange = (key, value) => {
        if (Object.keys(vehicleDateFields).includes(key)) {
            value = new Date(value).toISOString().split("T")[0];
            console.log(value);
        }
        onChange({ ...state, [key]: value });
        setState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <Stack sx={{ width: "100%", minWidth: isSm ? 0 : 400 }} spacing={1}>
            {Object.entries(vehicleDetailFields).map(([key, label]) => {
                return (
                    <TextField
                        key={key}
                        fullWidth
                        aria-label={label}
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
            {Object.entries(vehicleDateFields).map(([key, label]) => {
                return (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DesktopDatePicker
                            label={label}
                            value={new Date(state[key])}
                            inputFormat="DD/MM/YYYY"
                            onChange={(value) => handleChange(key, value)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                );
            })}
        </Stack>
    );
}

VehicleEditDetailsDialog.propTypes = {
    values: PropTypes.object,
    onChange: PropTypes.func,
};

VehicleEditDetailsDialog.defaultProps = {
    values: {},
    onChange: () => {},
};

export default VehicleEditDetailsDialog;
