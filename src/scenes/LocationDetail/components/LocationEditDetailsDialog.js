import React from "react";
import PropTypes from "prop-types";
import { Stack, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import { locationFields } from "./LocationProfile";

function LocationEditDetailsDialog({ values, onChange }) {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const [state, setState] = React.useState(values);

    return (
        <Stack sx={{ width: "100%", minWidth: isSm ? 0 : 400 }} spacing={1}>
            {Object.entries(locationFields).map(([key, label]) => {
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
                            onChange({
                                ...state,
                                [key]: value,
                            });
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

LocationEditDetailsDialog.propTypes = {
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func,
};

LocationEditDetailsDialog.defaultProps = {
    onChange: () => {},
};

export default LocationEditDetailsDialog;
