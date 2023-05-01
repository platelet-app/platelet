import React from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";

type AddToListButtonProps = {
    onClick: () => void;
    label: string;
};

const AddToListButton: React.FC<AddToListButtonProps> = ({
    onClick,
    label,
}) => {
    return (
        <Stack alignItems="center" direction="row">
            <Typography
                onClick={onClick}
                sx={{ cursor: "pointer" }}
                variant="h5"
            >
                {label}
            </Typography>
            <IconButton aria-label={label} onClick={onClick}>
                <AddCircleOutline fontSize="large" />
            </IconButton>
        </Stack>
    );
};

export default AddToListButton;
