import React, { useState } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import PropTypes from "prop-types";

function ClearButtonWithConfirmation(props) {
    const [open, setOpen] = useState(false);

    function onClick() {
        setOpen(true);
    }

    function onSelect(result) {
        props.onClear();
        setOpen(false);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <Box>
            <ConfirmationDialog
                onConfirmation={onSelect}
                dialogTitle={"Are you sure?"}
                onClose={handleClose}
                open={open}
            >
                <Typography>
                    Are you sure you want to clear the{" "}
                    {props.label.toLowerCase()} location?
                </Typography>
            </ConfirmationDialog>
            <Button
                sx={{ color: "red", borderColor: "red", width: "25%" }}
                disabled={props.disabled}
                onClick={onClick}
                variant={"outlined"}
                size="small"
            >
                Clear
            </Button>
        </Box>
    );
}

ClearButtonWithConfirmation.propTypes = {
    disabled: PropTypes.bool,
    onClear: PropTypes.func,
    label: PropTypes.string,
};

ClearButtonWithConfirmation.defaultProps = {
    disabled: false,
    onClear: () => {},
    label: "",
};

export default ClearButtonWithConfirmation;
