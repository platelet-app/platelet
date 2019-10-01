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

class TaskDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.onSelectPickup = this.onSelectPickup.bind(this);
        this.onSelectDropoff = this.onSelectDropoff.bind(this);
        this.onSelectRider = this.onSelectRider.bind(this);
    }

    componentDidMount() {
        if (this.props.task.pickup_address) {
            this.setState({
                    pickupAddress: this.props.task.pickup_address
                }
            )
        }
        if (this.props.task.dropoff_address) {
            this.setState({
                    dropoffAddress: this.props.task.dropoff_address
                }
            )
        }
        if (this.props.task.rider) {
            this.setState({
                    assignedRider: this.props.task.rider
                }
            )
        }
    }


    state = {
        uuid: this.props.task.uuid,
        assignedRider: {
            name: "",
            patch: "",
            vehicle: "",
            uuid: ""
        },
        contactNumber: this.props.task.contact_number,
        contactName: this.props.task.contact_name,
        dropoffTime: this.props.task.dropoff_time,
        pickupTime: this.props.task.pickup_time,
        timestamp: this.props.task.timestamp,

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
        if (result.length === 1) {
            this.setState({
                    pickupAddress: {
                        ward: result[0]['address']['ward'],
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

        if (result.length === 1) {
            this.setState({
                    dropoffAddress: {
                        ward: result[0]['address']['ward'],
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

    onSelectRider(selectedItem) {
        //let result = this.props.users.filter(rider => rider.uuid === selectedItem.uuid);
    }

    handleClickOpen() {
        this.setState({open: true});
    }


    handleClose() {
        this.setState({open: false})
        const payload = {
            pickup_address: this.state.pickupAddress,
            dropoff_address: this.state.dropoffAddress
            //assigned_rider: this.state.assignedRider.uuid
        };

        this.props.apiControl.tasks.updateTask(this.state.uuid, payload)
    }

    render() {
        return (
            <div>
                <TaskCard
                    title={"Task"}
                    pickupAddress={this.state.pickupAddress}
                    dropoffAddress={this.state.dropoffAddress}
                    assignedRider={this.state.assignedRider}
                    pickupTime={this.state.pickupTime}
                    dropoffTime={this.state.dropoffTime}
                    timestamp={this.state.timestamp}

                    onClick={() => {
                        this.handleClickOpen()
                    }}/>
                <Dialog fullScreen={true} open={this.state.open} onClose={this.handleClose}

                        aria-labelledby="form-dialog-title">
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
                        <UsersSelect id="userSelect" suggestions={this.props.userSuggestions}
                                     onSelect={this.onSelectRider}/>
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