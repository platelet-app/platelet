import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/material";
import { styled } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { modalTrackerSelector } from "../redux/Selectors";
import { v4 as uuidv4 } from "uuid";
import * as modalTrackerActions from "../redux/modalTracker/modalTrackerActions";

const RoundedDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
        [theme.breakpoints.down("sm")]: {
            borderRadius: "0em",
        },
        [theme.breakpoints.up("sm")]: {
            borderRadius: "1em",
        },
    },
}));

function ConfirmationDialog({ onCancel, open, ...props }) {
    const modalId = React.useRef(uuidv4());
    const modalTracker = useSelector(modalTrackerSelector);
    const dispatch = useDispatch();
    React.useEffect(() => {
        console.log("tracker", modalTracker);
    }, [modalTracker]);
    React.useEffect(() => {
        const currentId = modalId.current;
        if (open) {
            dispatch(modalTrackerActions.appendModal(currentId));
        } else {
            dispatch(modalTrackerActions.removeModal(currentId));
        }
        return () => {
            dispatch(modalTrackerActions.removeModal(currentId));
        };
    }, [open, dispatch]);
    const onBackKeyDown = React.useCallback(() => {
        if (modalTracker[modalTracker.length - 1] === modalId.current) {
            onCancel();
        }
    }, [onCancel, modalTracker]);
    React.useEffect(() => {
        if (window.cordova && open) {
            document.addEventListener("backbutton", onBackKeyDown, false);
            return () => {
                if (window.cordova) {
                    document.removeEventListener(
                        "backbutton",
                        onBackKeyDown,
                        false
                    );
                }
            };
        }
    }, [onBackKeyDown, open]);
    return (
        <RoundedDialog
            open={open}
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
                                onCancel();
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
