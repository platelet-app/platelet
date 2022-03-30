import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Styles } from "../styles";
import { Chip, Stack, TextField } from "@mui/material";
import { commentVisibility } from "../../../apiConsts";

function VisibilityMenu(props) {
    return (
        <Stack direction="row" spacing={1}>
            <Chip
                variant={
                    props.value === commentVisibility.everyone
                        ? "default"
                        : "outlined"
                }
                color={
                    props.value === commentVisibility.everyone
                        ? "primary"
                        : "default"
                }
                onClick={() => props.onChange(commentVisibility.everyone)}
                label={"EVERYONE"}
            />
            <Chip
                variant={
                    props.value === commentVisibility.me
                        ? "default"
                        : "outlined"
                }
                color={
                    props.value === commentVisibility.me ? "primary" : "default"
                }
                onClick={() => props.onChange(commentVisibility.me)}
                label={"ONLY ME"}
            />
        </Stack>
    );
}

export const Notes = ({ onChange, handleVisibilityChange }) => {
    const classes = Styles();
    const [visibility, setVisibility] = useState(commentVisibility.everyone);

    return (
        <div className={classes.block}>
            <Typography variant="h6" gutterBottom>
                {"Who should the notes be visible to?"}
            </Typography>
            <VisibilityMenu
                value={visibility}
                onChange={(value) => {
                    setVisibility(value);
                    handleVisibilityChange(value);
                }}
            />
            <TextField
                id="notes"
                placeholder={
                    visibility === commentVisibility.everyone
                        ? "Write a comment that will be visible to anyone..."
                        : "Write a comment only you can see..."
                }
                fullWidth
                multiline
                onChange={(e) => onChange(e.target.value)}
                className={classes.textField}
                margin="normal"
            />
        </div>
    );
};
