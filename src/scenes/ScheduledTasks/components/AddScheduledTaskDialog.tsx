import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { CallerDetails } from "../../GuidedSetup/components/CallerDetails";

type AddScheduledTaskDialogProps = {
    open: boolean;
    onCancel: () => void;
};

const AddScheduledTaskDialog: React.FC<AddScheduledTaskDialogProps> = ({
    open,
    onCancel,
}) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Add a scheduled task</DialogTitle>
            <DialogContent>
                <ScheduledTaskCallerDetails />
            </DialogContent>
        </Dialog>
    );
};

export default AddScheduledTaskDialog;
