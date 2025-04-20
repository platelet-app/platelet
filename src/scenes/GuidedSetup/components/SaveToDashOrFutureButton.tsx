import { Button, Divider, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import CachedIcon from "@mui/icons-material/Cached";

type SaveToDashOrFutureButtonProps = {
    onClick: () => void;
    disabled?: boolean;
    value: "new" | "future" | null;
    onChange: (value: "new" | "future") => void;
};

const SaveToDashOrFutureButton: React.FC<SaveToDashOrFutureButtonProps> = ({
    onClick,
    disabled,
    value,
    onChange,
}) => {
    const handleChange = (e: React.MouseEvent) => {
        if (value === "new") {
            onChange("future");
        } else {
            onChange("new");
        }
        e.stopPropagation();
    };
    const theme = useTheme();
    let message = "Save to dashboard";
    if (value === "new") {
        message = "Save to dashboard";
    } else if (value === "future") {
        message = "Save to upcoming";
    }
    const buttonTextColor = theme.palette.mode === "dark" ? "black" : "white";
    return (
        <Button
            data-cy="save-to-dash-button"
            onClick={onClick}
            disabled={disabled}
            variant="contained"
            sx={{
                minHeight: "55px",
            }}
            autoFocus
        >
            {message}
            {value && (
                <>
                    <Divider
                        orientation="vertical"
                        flexItem
                        variant="fullWidth"
                        sx={{
                            marginLeft: 1,
                            marginRight: 1,
                            backgroundColor: buttonTextColor,
                        }}
                    />
                    <IconButton onClick={handleChange} size="small">
                        <CachedIcon
                            sx={{
                                color: buttonTextColor,
                            }}
                        />
                    </IconButton>
                </>
            )}
        </Button>
    );
};

export default SaveToDashOrFutureButton;
