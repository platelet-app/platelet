import { Stack, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import React, { useState, useEffect } from "react";

function UserDisplayNameDialog({ values, onChange }) {
    const [state, setState] = useState(values);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        onChange({ displayName: state });
    }, [state, onChange]);

    return (
        <Stack sx={{ width: "100%", minWidth: isSm ? 0 : 400 }} spacing={1}>
            <TextField
                fullWidth
                aria-label="display-name"
                label={"Display name"}
                margin="normal"
                value={state.displayName}
                onChange={(e) => {
                    setState(e.target.value);
                }}
            />
        </Stack>
    );
}

export default UserDisplayNameDialog;
