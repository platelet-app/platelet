import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

type CopyFailedDialogProps = {
    text: string;
    onClose: () => void;
};

const CopyFailedDialog: React.FC<CopyFailedDialogProps> = ({
    text,
    onClose,
}) => {
    return (
        <Dialog
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "1em",
                },
            }}
            data-testid="copy-failed-dialog"
            open={!!text}
        >
            <DialogTitle>Select and copy the text below</DialogTitle>
            <DialogContent>{text}</DialogContent>
            <DialogActions>
                <Button
                    aria-label="OK"
                    data-testid="copy-ok-button"
                    onClick={onClose}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CopyFailedDialog;
