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
import UsersSelect from "./UsersSelect";
import ToggleTimeStamp from "./ToggleTimeStamp";
import {convertDate} from "../utilities.js"

class TaskDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.onSelectPickup = this.onSelectPickup.bind(this);
        this.onSelectDropoff = this.onSelectDropoff.bind(this);
        this.onSelectRider = this.onSelectRider.bind(this);
        this.onSelectPickedUp = this.onSelectPickedUp.bind(this);
        this.onSelectDroppedOff = this.onSelectDroppedOff.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    state = {
        open: false,
        pickupLabel: "Pickup address - ",
        dropoffLabel: "Dropoff address - "
    };

    componentDidMount() {
        let pick = "";
        let drop = "";
        if (this.props.pickupAddress) {
            pick = this.props.pickupAddress.line1
        }
        if (this.props.dropoffAddress) {
            drop = this.props.dropoffAddress.line1
        }
        this.setState({
            pickupLabel: this.state.pickupLabel + pick,
            dropoffLabel: this.state.dropoffLabel + drop
        })
    }

    onSelectPickup(selectedItem) {
        let result = this.props.locations.filter(location => location.name === selectedItem);
        if (result.length === 1) {
            let pickup_address = {
                ward: result[0]['address']['ward'],
                line1: result[0]['address']['line1'],
                line2: result[0]['address']['line2'],
                town: result[0]['address']['town'],
                county: result[0]['address']['county'],
                country: result[0]['address']['country'],
                postcode: result[0]['address']['postcode'],

            };
            this.sendData({pickup_address: pickup_address});
            this.props.updateCallback(this.props.uuid, {pickup_address: pickup_address});
            this.setState({
                pickupLabel: "Pickup address - " + pickup_address.line1
            });
        }
        else {
            this.setState({
                pickupLabel: "Pickup address - "
            });
        }
    }

    onSelectDropoff(selectedItem) {
        let result = this.props.locations.filter(location => location.name === selectedItem);

        if (result.length === 1) {
            let dropoff_address = {
                ward: result[0]['address']['ward'],
                line1: result[0]['address']['line1'],
                line2: result[0]['address']['line2'],
                town: result[0]['address']['town'],
                county: result[0]['address']['county'],
                country: result[0]['address']['country'],
                postcode: result[0]['address']['postcode']};
            this.sendData({dropoff_address: dropoff_address});
            this.props.updateCallback(this.props.uuid, {dropoff_address: dropoff_address});

            this.setState({
                dropoffLabel: "Dropoff address - " + dropoff_address.line1
            });
        }
        else {
            this.setState({
                dropoffLabel: "Dropoff address - "
            });
        }

    }

    sendData(payload) {
        console.log(payload)
        this.props.apiControl.tasks.updateTask(this.props.uuid, payload)
    }

    onSelectRider(selectedItem) {
        let result = this.props.users.filter(rider => rider.name === selectedItem);
        if (result.length === 1) {
            let rider = {
                name: result[0]['name'],
                patch: result[0]['patch'],
                vehicle: result[0]['vehicle'],
                uuid: result[0]['uuid']
            };
            this.sendData({assigned_rider: rider.uuid})
            console.log(rider)
            this.props.updateCallback(this.props.uuid, {assigned_rider: rider.uuid, rider: rider});
        }
    }

    onSelectPickedUp(status) {
        let pickup_time = status ? new Date().toISOString() : null
        this.setState(
            {
                pickupTime: pickup_time
            }
        );
        this.sendData({pickup_time: pickup_time})
        this.props.updateCallback(this.props.uuid, {pickup_time: pickup_time});
    }

    onSelectDroppedOff(status) {
        let dropoff_time = status ? new Date().toISOString() : null
        this.sendData({dropoff_time: dropoff_time})
        this.props.updateCallback(this.props.uuid, {dropoff_time: dropoff_time});
    }

    handleClickOpen() {
        this.setState({open: true});
    }


    handleClose() {
        this.setState({open: false});
    }

    render() {
        return (
            <div>
                <TaskCard
                    title={"Task"}
                    pickupAddress={this.props.pickupAddress}
                    dropoffAddress={this.props.dropoffAddress}
                    assignedRider={this.props.assignedRider}
                    pickupTime={this.props.pickupTime}
                    dropoffTime={this.props.dropoffTime}
                    timestamp={this.props.timestamp}

                    onClick={() => {
                        this.handleClickOpen()
                    }}/>
                <Dialog fullScreen={true} open={this.state.open} onClose={this.handleClose}

                        aria-labelledby="form-dialog-title">
                    <DialogActions>
                        <Button onClick={() => {
                            this.handleClose({
                                "task": this.props.uuid,
                                "body": document.getElementById("note").value
                            })
                        }} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                    <DialogTitle id="form-dialog-title">Task Detail</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Task {this.props.uuid} yay!
                        </DialogContentText>
                        <AddressDetailsCollapsible label={this.state.pickupLabel}
                                                   onSelect={this.onSelectPickup}
                                                   locations={this.props.locations}
                                                   suggestions={this.props.suggestions}
                                                   address={this.props.pickupAddress}
                        />
                        <br/>
                        <AddressDetailsCollapsible label={this.state.dropoffLabel}
                                                   onSelect={this.onSelectDropoff}
                                                   locations={this.props.locations}
                                                   suggestions={this.props.suggestions}
                                                   address={this.props.dropoffAddress}/>
                        <UsersSelect id="userSelect" suggestions={this.props.userSuggestions}
                                     onSelect={this.onSelectRider}/>

                        <ToggleTimeStamp label={"Picked Up"} status={!!this.props.pickupTime} onSelect={this.onSelectPickedUp}/>
                        {convertDate(this.props.pickupTime)}
                        <ToggleTimeStamp label={"Delivered"}  status={!!this.props.dropoffTime} onSelect={this.onSelectDroppedOff}/>
                        {convertDate(this.props.dropoffTime)}
                        <TextField
                            margin="dense"
                            id="note"
                            label="Add a note!"
                            type="text"
                            fullWidth
                        />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default withRouter(TaskDialog);