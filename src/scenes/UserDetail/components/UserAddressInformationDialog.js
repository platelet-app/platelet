import { Stack, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import React, { useState } from "react";
import { userAddressFields } from "./UserProfile";

function UserAddressInformationDialog({ values, onChange }) {
    const [state, setState] = useState(values);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    const handleChange = (key, value) => {
        setState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
        onChange({ contact: { ...state, [key]: value } });
    };

    return (
        <Stack sx={{ width: "100%", minWidth: isSm ? 0 : 400 }} spacing={1}>
            {Object.keys(state ? userAddressFields : []).map((key) => {
                return (
                    <TextField
                        key={key}
                        value={state[key]}
                        fullWidth
                        label={userAddressFields[key]}
                        id={key}
                        onChange={(e) => {
                            const { value } = e.target;
                            handleChange(key, value);
                        }}
                    />
                );
            })}
        </Stack>
    );
}

export default UserAddressInformationDialog;
