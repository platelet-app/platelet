import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {TaskCard} from "./TaskCardsColoured";
import FavouriteLocationsSelect from "./FavouriteLocationsSelect";

export default function TaskDialog(props) {
    const [open, setOpen] = React.useState(false);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose(data) {
        setOpen(false);
        if(false) {
            saveDetails(data)
        }
    }

    function saveDetails(inputData) {
        props.apiControl.notes.createNote(inputData).then((data) => {
            console.log(data);
        })
    }

    return (
        <div>
            <TaskCard task={props.task} onClick={handleClickOpen}/>
            <Dialog fullScreen={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Task Detail</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Task {props.task.uuid} yay!
                    </DialogContentText>
                    <FavouriteLocationsSelect apiControl={props.apiControl}/>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="note"
                        label="Add a note!"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {handleClose({"task": props.task.uuid, "body": document.getElementById("note").value})}} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}