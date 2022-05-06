import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Styles } from "../styles";
import { Stack, TextField } from "@mui/material";
import { commentVisibility } from "../../../apiConsts";
import CommentVisibilitySelector from "../../../components/CommentVisibilitySelector";
import PrioritySelect from "../../Task/components/PrioritySelect";

export const Notes = ({
    onChange,
    handleVisibilityChange,
    onChangePriority,
}) => {
    const classes = Styles();
    const [visibility, setVisibility] = useState(commentVisibility.everyone);
    const [priority, setPriority] = useState(null);

    return (
        <Stack direction="column" spacing={2} className={classes.block}>
            <Stack>
                <Typography variant="h6">What is the priority?</Typography>
                <PrioritySelect
                    priority={priority}
                    onSelect={onChangePriority}
                />
            </Stack>
            <Stack>
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
            </Stack>
        </Stack>
    );
};
