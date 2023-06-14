import React from "react";
import * as models from "../../../models";
import { Box, TextField, Typography } from "@mui/material";
import isEmail from "validator/lib/isEmail";

type UserEmailDialogProps = {
    user: models.User;
    onChange: (email: string) => void;
    onDisable: (disabled: boolean) => void;
};

const UserEmailDialog: React.FC<UserEmailDialogProps> = ({
    user,
    onDisable,
    onChange,
}) => {
    const [state, setState] = React.useState(user.contact?.emailAddress);
    const [error, setError] = React.useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value && !isEmail(value)) {
            setError("Please enter a valid email address");
            onDisable(true);
        } else if (!value) {
            setError(null);
            onDisable(true);
        } else {
            setError(null);
            onDisable(false);
        }
        onChange(value);
        setState(value);
    };

    return (
        <Box sx={{ minHeight: 80 }}>
            <Typography>
                The user will need to use this email to log in.
            </Typography>
            <TextField
                helperText={error}
                color={error ? "error" : "primary"}
                sx={{ minWidth: 300 }}
                onChange={handleChange}
                value={state}
            />
        </Box>
    );
};

export default UserEmailDialog;
