import { Stack, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import React, { useState, useEffect } from "react";
import { userAddressFields } from "./UserProfile";

function UserAddressInformationDialog({ values, onChange }) {
    const [state, setState] = useState(values);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        onChange({ contact: state });
    }, [state, onChange]);

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
