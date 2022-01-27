import React, { useState } from "react";
import { Tooltip, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
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
        <>
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
            <Tooltip title={"Clear"}>
                <IconButton
                    disabled={props.disabled}
                    onClick={onClick}
                    size="small"
                >
                    <CancelIcon />
                </IconButton>
            </Tooltip>
        </>
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
