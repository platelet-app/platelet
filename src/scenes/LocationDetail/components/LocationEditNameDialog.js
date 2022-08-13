import React from "react";
import PropTypes from "prop-types";
import { Stack, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";

function LocationEditNameDialog({ values, onChange }) {
    const theme = useTheme();

    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const [state, setState] = React.useState({
        name: values.name,
    });
    return (
        <Stack sx={{ width: "100%", minWidth: isSm ? 0 : 400 }} spacing={1}>
            {
                <TextField
                    key={"Name"}
                    fullWidth
                    inputProps={{
                        "aria-label": "Name",
                    }}
                    label={"Name"}
                    margin="normal"
                    value={state["name"]}
                    onChange={(e) => {
                        const { value } = e.target;
                        setState({ name: value });
                        onChange({ name: value });
                    }}
                />
            }
        </Stack>
    );
}

LocationEditNameDialog.propTypes = {
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func,
};

LocationEditNameDialog.defaultProps = {
    onChange: () => {},
};

export default LocationEditNameDialog;
