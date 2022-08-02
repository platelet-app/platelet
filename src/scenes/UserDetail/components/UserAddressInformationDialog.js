import { Stack, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import React, { useState, useEffect } from "react";

const addressFields = {
    line1: "Line 1",
    line2: "Line 2",
    line3: "Line 3",
    town: "Town",
    county: "County",
    country: "Country",
    postcode: "Postcode",
};

function UserAddressInformationDialog({ values, onChange }) {
    const [state, setState] = useState(values);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        onChange({ contact: state });
    }, [state, onChange]);

    return (
        <Stack sx={{ width: "100%", minWidth: isSm ? 0 : 400 }} spacing={1}>
            {Object.keys(state ? addressFields : []).map((key) => {
                return (
                    <TextField
                        key={key}
                        value={state[key]}
                        fullWidth
                        label={addressFields[key]}
                        id={key}
                        onChange={(e) => {
                            setState((prevState) => ({
                                ...prevState,
                                [key]: e.target.value,
                            }));
                        }}
                    />
                );
            })}
        </Stack>
    );
}

export default UserAddressInformationDialog;
