import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/material";
import { styled } from "@mui/styles";

const RoundedDialog = styled(Dialog)(({ fullScreen }) => ({
    "& .MuiDialog-paper": {
        borderRadius: fullScreen ? "0em" : "1em",
    },
}));

function ConfirmationDialog(props) {
    return (
        <RoundedDialog
            open={props.open}
            fullScreen={props.fullScreen}
            onClose={props.onClose}
            PaperProps={{ elevation: 1 }}
        >
            <DialogTitle>{props.dialogTitle}</DialogTitle>
            <DialogContent>
                <Box sx={{ padding: 1 }}>{props.children}</Box>
            </DialogContent>
            <DialogActions>
                <Stack
                    direction="row"
                    sx={{ width: "100%" }}
                    justifyContent="space-between"
                >
                    {props.hideCancel ? (
                        <div></div>
                    ) : (
                        <Button
                            data-testid="confirmation-cancel-button"
                            aria-label="Cancel"
                            onClick={() => {
                                props.onCancel();
                            }}
                            autoFocus
                        >
                            Cancel
                        </Button>
                    )}{" "}
                    {!props.hideOk && (
                        <Button
                            disabled={props.disabled}
                            aria-label="OK"
                            data-testid="confirmation-ok-button"
                            onClick={() => {
                                props.onConfirmation();
                            }}
                            autoFocus
                        >
                            OK
                        </Button>
                    )}
                </Stack>
            </DialogActions>
        </RoundedDialog>
    );
}

ConfirmationDialog.propTypes = {
    open: PropTypes.bool,
    onConfirmation: PropTypes.func,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    dialogTitle: PropTypes.string,
    hideCancel: PropTypes.bool,
    hideOk: PropTypes.bool,
    fullScreen: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.node,
};

ConfirmationDialog.defaultProps = {
    open: false,
    dialogTitle: "",
    onConfirmation: () => {},
    onCancel: () => {},
    onClose: null,
    hideCancel: false,
    hideOk: false,
    fullScreen: false,
    disabled: false,
    children: null,
};

export default ConfirmationDialog;
