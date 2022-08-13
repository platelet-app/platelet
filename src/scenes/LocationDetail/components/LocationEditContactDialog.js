import { Stack, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";
import React from "react";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { locationContactFields } from "./LocationProfile";

function LocationEditContactDialog({ values, onChange }) {
    const [state, setState] = React.useState(values);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Stack sx={{ width: "100%", minWidth: isSm ? 0 : 400 }} spacing={1}>
            {Object.entries(locationContactFields).map(([key, label]) => {
                return (
                    <TextFieldUncontrolled
                        tel={key === "telephoneNumber"}
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
                                contact: {
                                    ...state,
                                    [key]: value,
                                },
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

LocationEditContactDialog.propTypes = {
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func,
};

LocationEditContactDialog.defaultProps = {
    onChange: () => {},
};

export default LocationEditContactDialog;
