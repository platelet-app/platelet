import React from 'react';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from "@material-ui/core";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavouriteLocationsSelect from "./FavouriteLocationsSelect";

export default class AddressDetailsCollapsible extends React.Component {
    constructor(props) {
        super(props);
    }
    classes = makeStyles(theme => ({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
    }));

    render() {
        console.log(this.props.address)
        return (
            <div className={this.classes.root}>
                <FavouriteLocationsSelect id="addressSelect" suggestions={this.props.suggestions}
                                          onSelect={this.props.onSelect}/>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="address-content"
                        id="address-header"
                    >
                        <Typography className={this.classes.heading}>{this.props.label}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div>
                            <TextField
                                margin="dense"
                                id="ward"
                                label="Ward"
                                type="text"
                                value={this.props.address.ward}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="line1"
                                label="Address Line 1"
                                type="text"
                                value={this.props.address.line1}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="line2"
                                label="Address Line 2"
                                type="text"
                                value={this.props.address.line2}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="town"
                                label="Town"
                                type="text"
                                value={this.props.address.town}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="county"
                                label="County"
                                type="text"
                                value={this.props.address.county}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="postcode"
                                label="Postcode"
                                type="text"
                                value={this.props.address.postcode}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="Country"
                                label="Country"
                                type="text"
                                value={this.props.address.country}
                                fullWidth
                            />
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        )
    }
}
