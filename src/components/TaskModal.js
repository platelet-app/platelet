import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {TaskCard} from "./TaskCardsColoured";
import AddressDetailsCollapsible from "./AddressDetail";

export default class TaskDialog extends React.Component {

    state = {
        open: false,
    };


    handleClickOpen() {
        this.setState({open: true});
    }


    handleClose() {
        this.setState({open: false})
    }

    render() {
        return (
            <div>
                <TaskCard task={this.props.task} onClick={() => {this.handleClickOpen()}}/>
                <Dialog fullScreen={true} open={this.state.open} onClose={() => {this.handleClose()}}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Task Detail</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Task {this.props.task.uuid} yay!
                        </DialogContentText>
                        <AddressDetailsCollapsible label={"Pickup Address Details"} apiControl={this.props.apiControl} address={this.state.pickupAddress}/>
                        <TextField
                            margin="dense"
                            id="note"
                            label="Add a note!"
                            type="text"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            this.handleClose({
                                "task": this.props.task.uuid,
                                "body": document.getElementById("note").value
                            })
                        }} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}