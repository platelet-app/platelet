import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Styles } from "../styles";
import { TextField } from "@mui/material";
import { commentVisibility } from "../../../apiConsts";
import CommentVisibilitySelector from "../../../components/CommentVisibilitySelector";

export const Notes = ({ onChange, handleVisibilityChange }) => {
    const classes = Styles();
    const [visibility, setVisibility] = useState(commentVisibility.everyone);

    return (
        <div className={classes.block}>
            <Typography variant="h6" gutterBottom>
                {"Who should the notes be visible to?"}
            </Typography>
            <CommentVisibilitySelector
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
