import React from 'react';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from "@material-ui/core";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavouriteLocationsSelect from "./FavouriteLocationsSelect";
import { TextFieldControlled, TextFieldUncontrolled }from "./TextFieldControlled";
import update from "immutability-helper";
import { useState } from 'react';

const useStyles = makeStyles(({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: "15px",
    },
}));


export default function AddressDetailsCollapsible(props){
    const classes = useStyles();

    const [address, setAddress] = useState(props.address);

    const onSelectPreset = selectedItem => {
        let result = props.locations.filter(location => location.name === selectedItem);
        if (result.length === 1) {
            let newAddress = {
                ward: result[0]['address']['ward'],
                line1: result[0]['address']['line1'],
                line2: result[0]['address']['line2'],
                town: result[0]['address']['town'],
                county: result[0]['address']['county'],
                country: result[0]['address']['country'],
                postcode: result[0]['address']['postcode'],

            };
            setAddress(newAddress);
            props.onSelect(newAddress);
        }
    }


        let presetSelect = <></>;
        if (!props.disabled) {
            presetSelect =
                <FavouriteLocationsSelect id="addressSelect" suggestions={props.suggestions}
                                          onSelect={onSelectPreset}
                                          disabled={props.disabled}/>;
        }
        return (
            <div className={classes.root}>
                {presetSelect}
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="address-content"
                        id="address-header"
                    >
                        <Typography className={classes.heading}>{props.label}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div>
                            <TextFieldUncontrolled
                                id={"what3words"}
                                label={"what3words"}
                                value={address ? address.what3words : ""}
                                onChange={e => {
                                    const updated = update(address, {what3words: {$set: e.target.value}})
                                    setAddress(updated)
                                }}
                                onSelect={e => props.onSelect(address)}
                            />
                            <TextFieldUncontrolled
                                id={"ward"}
                                label={"Ward"}
                                value={address ? address.ward : ""}
                                onChange={e => {
                                    const updated = update(address, {ward: {$set: e.target.value}})
                                    setAddress(updated)
                                }}
                                onSelect={e => {console.log("YAY"); props.onSelect(address)}}
                            />
                            <TextFieldUncontrolled
                                id={"line1"}
                                label={"Line one"}
                                value={address ? address.line1 : ""}
                                onChange={e => {
                                    const updated = update(address, {line1: {$set: e.target.value}})
                                    setAddress(updated)
                                }}
                                onSelect={e => props.onSelect(address)}
                            />
                            <TextFieldUncontrolled
                                id={"line2"}
                                label={"Line two"}
                                value={address ? address.line2 : ""}
                                onChange={e => {
                                    const updated = update(address, {line2: {$set: e.target.value}})
                                    setAddress(updated)
                                }}
                                onSelect={e => props.onSelect(address)}
                            />
                            <TextFieldUncontrolled
                                id={"town"}
                                label={"Town"}
                                value={address ? address.town : ""}
                                onChange={e => {
                                    const updated = update(address, {town: {$set: e.target.value}})
                                    setAddress(updated)
                                }}
                                onSelect={e => props.onSelect(address)}
                            />
                            <TextFieldUncontrolled
                                id={"county"}
                                label={"County"}
                                value={address ? address.county : ""}
                                onChange={e => {
                                    const updated = update(address, {county: {$set: e.target.value}})
                                    setAddress(updated)
                                }}
                                onSelect={e => props.onSelect(address)}
                            />
                            <TextFieldUncontrolled
                                id={"postcode"}
                                label={"Postcode"}
                                value={address ? address.postcode : ""}
                                onChange={e => {
                                    const updated = update(address, {postcode: {$set: e.target.value}})
                                    setAddress(updated)
                                }}
                                onSelect={e => props.onSelect(address)}
                            />
                            <TextFieldUncontrolled
                                id={"county"}
                                label={"Country"}
                                value={address ? address.country : ""}
                                onChange={e => {
                                    const updated = update(address, {country: {$set: e.target.value}})
                                    setAddress(updated)
                                }}
                                onSelect={e => props.onSelect(address)}
                            />
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        )
}
