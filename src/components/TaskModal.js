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
import update from 'immutability-helper';
import moment from 'moment/min/moment-with-locales';
import Moment from "react-moment";
import PrioritySelect from "./PrioritySelect";


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
        this.onSelectPriority = this.onSelectPriority.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    state = {
        open: false,
        pickupLabel: "Pickup address - ",
        dropoffLabel: "Dropoff address - ",
        pickupTime: this.props.pickupTime,
        dropoffTime: this.props.dropoffTime,
        pickupAddress: this.props.pickupAddress,
        dropoffAddress: this.props.dropoffAddress,
        assignedRider: this.props.assignedRider,
        priority: this.props.priority,
        payLoad: {}
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
            dropoffLabel: this.state.dropoffLabel + drop,
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
            const updated = update(this.state.payLoad, {pickup_address: {$set: pickup_address}})
            this.setState({
                payLoad: updated,
                pickupLabel: "Pickup address - " + pickup_address.line1,
                pickupAddress: pickup_address
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
            const updated = update(this.state.payLoad, {dropoff_address: {$set: dropoff_address}})
            this.setState({
                payLoad: updated,
                dropoffAddress: dropoff_address,
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
        this.props.apiControl.tasks.updateTask(this.props.uuid, payload)
    }

    onSelectRider(selectedItem) {
        let result = this.props.users.filter(rider => rider.display_name === selectedItem);
        if (result.length === 1) {
            let rider = {
                name: result[0]['name'],
                patch: result[0]['patch'],
                vehicle: result[0]['vehicle'],
                uuid: result[0]['uuid']
            };
            this.sendData({assigned_rider: rider.uuid});
            const updated = update(this.state.payLoad,
                {
                    rider:
                        {$set: rider},
                    assigned_rider:
                        {$set: rider.uuid}
                }
            );
            this.setState({
                payLoad: updated,
                assignedRider: rider
            });
        }
    }

    onSelectPriority(selectedItemId) {
        let result = this.props.availablePriorities.filter(item => item.id === selectedItemId);
        this.sendData({priority_id: selectedItemId});
        if (result.length === 1) {
            this.setState({
                priority: result[0].label
            });
            const updated = update(this.state.payLoad, {priority: {$set: result[0].label}});
            console.log(updated)

            this.setState({
                payLoad: updated
            })
        }
    }

    onSelectPickedUp(status) {
        let pickup_time = status ? moment.utc().toISOString() : null
        this.setState(
            {
                pickupTime: pickup_time
            }
        );
        this.sendData({pickup_time: pickup_time});
        const updated = update(this.state.payLoad, {pickup_time: {$set: pickup_time}});
        this.setState({
            payLoad: updated,
            pickupTime: pickup_time
        });
    }

    onSelectDroppedOff(status) {
        let dropoff_time = status ? moment.utc().toISOString() : null
        this.sendData({dropoff_time: dropoff_time});
        const updated = update(this.state.payLoad, {dropoff_time: {$set: dropoff_time}});
        this.setState({
            payLoad: updated,
            dropoffTime: dropoff_time
        });
    }

    handleClickOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.props.updateCallback(this.props.uuid, this.state.payLoad);
        this.setState({
            open: false,
            payLoad: {}
        });
    }

    render() {
        let usersSelect = <></>;
        if(!this.props.riderView) {
            usersSelect =
                <>
                    <UsersSelect id="userSelect" suggestions={this.props.userSuggestions}
                                 onSelect={this.onSelectRider}
                                 disabled={this.props.riderView}/>
                    <DialogContentText>
                        {this.state.assignedRider ? "Currently assigned to " + this.state.assignedRider.name + "." : ""}
                    </DialogContentText>
                </>;
        }
        let prioritySelect = <></>
        if (this.props.riderView) {
            prioritySelect = this.props.priority ? <><br/><DialogContentText>Priority {this.props.priority}</DialogContentText></> : ""

        }
        else {
            prioritySelect = <PrioritySelect priority={this.props.priority}
                                                 availablePriorities={this.props.availablePriorities}
                                                 onSelect={this.onSelectPriority}/>;
        }
        let pickupTimeNotice = <></>;
        if (this.state.pickupTime) {
            pickupTimeNotice = <>Picked up at <Moment format={"llll"}>{this.state.pickupTime}</Moment></>
        }
        let dropoffTimeNotice = <></>;
        if (this.state.dropoffTime) {
            dropoffTimeNotice = <>Dropped off at <Moment format={"llll"}>{this.state.dropoffTime}</Moment></>
        }
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
                    priority={this.props.priority}

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
                    <DialogTitle id="form-dialog-title">
                        {this.state.pickupAddress ? this.state.pickupAddress.line1 + " to " : ""} {this.state.dropoffAddress ? this.state.dropoffAddress.line1 + " " : ""} {this.state.assignedRider ? "assigned to " + this.state.assignedRider.name : ""}
                    </DialogTitle>
                    <DialogContent>
                        <AddressDetailsCollapsible label={this.state.pickupLabel}
                                                   onSelect={this.onSelectPickup}
                                                   locations={this.props.locations}
                                                   suggestions={this.props.suggestions}
                                                   address={this.state.pickupAddress}
                                                   disabled={this.props.riderView}
                        />
                        <br/>
                        <AddressDetailsCollapsible label={this.state.dropoffLabel}
                                                   onSelect={this.onSelectDropoff}
                                                   locations={this.props.locations}
                                                   suggestions={this.props.suggestions}
                                                   address={this.state.dropoffAddress}
                                                   disabled={this.props.riderView}/>
                        <br/>
                        {usersSelect}
                        <br/>
                        {prioritySelect}

                        <br/>

                        <ToggleTimeStamp label={"Picked Up"} status={!!this.state.pickupTime} onSelect={this.onSelectPickedUp}/>
                        <DialogContentText>
                            {pickupTimeNotice}
                        </DialogContentText>
                        <br/>
                        <ToggleTimeStamp label={"Delivered"}  status={!!this.state.dropoffTime} onSelect={this.onSelectDroppedOff}/>
                        <DialogContentText>
                            {dropoffTimeNotice}
                        </DialogContentText>
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