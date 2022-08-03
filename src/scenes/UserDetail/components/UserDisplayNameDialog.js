import { Stack, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import React, { useState } from "react";

function UserDisplayNameDialog({ values, onChange }) {
    const [state, setState] = useState(values);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    function onSet(e) {
        setState({ displayName: e.target.value });
        onChange({ displayName: e.target.value });
    }

    return (
        <Stack sx={{ width: "100%", minWidth: isSm ? 0 : 400 }} spacing={1}>
            <TextField
                fullWidth
                inputProps={{
                    "aria-label": "display name",
                }}
                label={"Display name"}
                value={state.displayName}
                onChange={onSet}
            />
        </Stack>
    );
}

export default UserDisplayNameDialog;
