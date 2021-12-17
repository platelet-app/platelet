import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { Stack } from "@mui/material";

function ConfirmationDialog(props) {
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
            <DialogContent>{props.children}</DialogContent>
            <DialogActions>
                <Stack
                    direction="row-reverse"
                    sx={{ width: "100%" }}
                    justifyContent="space-between"
                >
                    {!props.hideCancel && (
                        <Button
                            onClick={() => {
                                props.onSelect(false);
                                props.onClose();
                            }}
                            autoFocus
                        >
                            Cancel
                        </Button>
                    )}{" "}
                    {!props.hideOk && (
                        <Button
                            onClick={() => {
                                props.onSelect(true);
                                props.onClose();
                            }}
                            autoFocus
                        >
                            OK
                        </Button>
                    )}
                </Stack>
            </DialogActions>
        </Dialog>
    );
}

ConfirmationDialog.propTypes = {
    open: PropTypes.bool,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    dialogTitle: PropTypes.string,
    hideCancel: PropTypes.bool,
    hideOk: PropTypes.bool,
};

ConfirmationDialog.defaultProps = {
    open: false,
    dialogTitle: "",
    onSelect: () => {},
    onClose: () => {},
    hideCancel: false,
    hideOk: false,
};

export default ConfirmationDialog;
