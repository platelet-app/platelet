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
import {withRouter} from 'react-router-dom';

class TaskDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.onSelectPickup = this.onSelectPickup.bind(this);
        this.onSelectDropoff = this.onSelectDropoff.bind(this);
    }

    state = {
        pickupAddress: {
            ward: "",
            line1: "",
            line2: "",
            town: "",
            county: "",
            postcode: "",
            country: "",
        },
        dropoffAddress: {
            ward: "",
            line1: "",
            line2: "",
            town: "",
            county: "",
            postcode: "",
            country: "",
        },
        pickupLabel: "Pick up address",
        dropoffLabel: "Drop off address",
        open: false,
    };

    onSelectPickup(selectedItem) {
        let result = this.props.locations.filter(location => location.name === selectedItem);
        console.log(this.props.locations);
        console.log(result);

        if (result.length === 1) {
            console.log(result[0]['line1']);
            this.setState({
                    pickupAddress: {
                        ward: result[0]['ward'],
                        line1: result[0]['address']['line1'],
                        line2: result[0]['address']['line2'],
                        town: result[0]['address']['town'],
                        county: result[0]['address']['county'],
                        country: result[0]['address']['country'],
                        postcode: result[0]['address']['postcode'],
                    },
                    pickupLabel: this.state.pickupLabel + ' - ' + result[0]['address']['line1']
                }
            );
            console.log(this.state.line1)
        } else {
            this.setState({
                pickupAddress: {
                    ward: "",
                    line1: "",
                    line2: "",
                    town: "",
                    county: "",
                    country: "",
                    postcode: ""
                },
                pickupLabel: "Pick up address"
            })
        }
    }

    onSelectDropoff(selectedItem) {
        let result = this.props.locations.filter(location => location.name === selectedItem);
        console.log(this.props.locations);
        console.log(result);

        if (result.length === 1) {
            console.log(result[0]['line1']);
            this.setState({
                    dropoffAddress: {
                        ward: result[0]['ward'],
                        line1: result[0]['address']['line1'],
                        line2: result[0]['address']['line2'],
                        town: result[0]['address']['town'],
                        county: result[0]['address']['county'],
                        country: result[0]['address']['country'],
                        postcode: result[0]['address']['postcode'],
                    },
                    dropoffLabel: this.state.dropoffLabel + ' - ' + result[0]['address']['line1']
                }
            );
            console.log(this.state.line1)
        } else {
            this.setState({
                dropoffAddress: {
                    ward: "",
                    line1: "",
                    line2: "",
                    town: "",
                    county: "",
                    country: "",
                    postcode: ""
                },
                dropoffLabel: "Drop off address"
            })
        }
    }

    handleClickOpen() {
        this.setState({open: true});
    }


    handleClose() {
        this.setState({open: false})
    }

    render() {
        return (
            <div>
                <TaskCard task={this.props.task} onClick={() => {
                    this.handleClickOpen()
                }}/>
                <Dialog fullScreen={true} open={this.state.open} onClose={this.handleClose}

                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Task Detail</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Task {this.props.task.uuid} yay!
                        </DialogContentText>
                        <AddressDetailsCollapsible label={this.state.pickupLabel}
                                                   onSelect={this.onSelectPickup}
                                                   locations={this.props.locations}
                                                   suggestions={this.props.suggestions}
                                                   address={this.state.pickupAddress}
                        />
                        <br/>
                        <AddressDetailsCollapsible label={this.state.dropoffLabel}
                                                   onSelect={this.onSelectDropoff}
                                                   locations={this.props.locations}
                                                   suggestions={this.props.suggestions}
                                                   address={this.state.dropoffAddress}/>
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

export default withRouter(TaskDialog);