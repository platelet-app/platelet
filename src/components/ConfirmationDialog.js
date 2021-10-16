import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";

function ConfirmationDialog(props) {
    const theme = useTheme();
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {props.dialogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.dialogText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        props.onSelect(false);
                        props.onClose();
                    }}
                    autoFocus
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        props.onSelect(true);
                        props.onClose();
                    }}
                    autoFocus
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ConfirmationDialog.propTypes = {
    open: PropTypes.bool,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    dialogText: PropTypes.string,
    dialogTitle: PropTypes.string,
};

ConfirmationDialog.defaultProps = {
    open: false,
    dialogText: "",
    dialogTitle: "",
    onSelect: () => {},
    onClose: () => {},
};

export default ConfirmationDialog;
