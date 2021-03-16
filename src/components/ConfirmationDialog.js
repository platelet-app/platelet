import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";

// Not used currently in favour of notifications.
function ConfirmationDialog(props) {
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{props.dialogTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.dialogText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.onSelect(false);
                    props.onClose();
                }} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => {
                    props.onSelect(true);
                    props.onClose();
                }} color="primary" autoFocus>
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
    dialogTitle: PropTypes.string
};

ConfirmationDialog.defaultProps = {
    open: false,
    dialogText: "",
    dialogTitle: "",
    onSelect: () => {},
    onClose: () => {}
};

export default ConfirmationDialog;
