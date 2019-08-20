import React from 'react';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from "@material-ui/core";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));
export default function AddressDetailsCollapsible (props) {
    const classes = useStyles();
    if (props.address !== undefined) {
    return (
        <div className={classes.root}>
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="address-content"
                    id="address-header"
                >
                    <Typography className={classes.heading}>{props.label} Address</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div>
                        <TextField
                            margin="dense"
                            id="ward"
                            label="Ward"
                            type="text"
                            value={props.address['ward']}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="line1"
                            label="Address Line 1"
                            type="text"
                            value={props.address['line1']}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="line2"
                            label="Address Line 2"
                            type="text"
                            value={props.address['line2']}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="town"
                            label="Town"
                            type="text"
                            value={props.address['town']}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="county"
                            label="County"
                            type="text"
                            value={props.address['county']}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="postcode"
                            label="Postcode"
                            type="text"
                            value={props.address['postcode']}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="Country"
                            label="Country"
                            type="text"
                            value={props.address['country']}
                            fullWidth
                        />
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    )}
        else {
        return (
            <div className={classes.root}>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="address-content"
                        id="address-header"
                    >
                        <Typography className={classes.heading}>{props.label} Address</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div>
                            <TextField
                                margin="dense"
                                id="ward"
                                label="Ward"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="line1"
                                label="Address Line 1"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="line2"
                                label="Address Line 2"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="town"
                                label="Town"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="county"
                                label="County"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="postcode"
                                label="Postcode"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="Country"
                                label="Country"
                                type="text"
                                fullWidth
                            />
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        )}
}
