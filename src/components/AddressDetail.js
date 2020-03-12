import React, {useEffect, useRef} from 'react';
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

    const [what3words, setWhat3words] = useState(props.address ? props.address.what3words || "" : "");
    const [ward, setWard] = useState(props.address ? props.address.ward || "" : "");
    const [line1, setLine1] = useState(props.address ? props.address.line1 || "" :  "");
    const [line2, setLine2] = useState(props.address ? props.address.line2 || "" : "");
    const [town, setTown] = useState(props.address ? props.address.town || "" : "");
    const [county, setCounty] = useState(props.address ? props.address.county || "" : "");
    const [country, setCountry] = useState(props.address ? props.address.country || "" : "");
    const [postcode, setPostcode] = useState(props.address ? props.address.country || "" : "");
    const firstUpdate = useRef(true);


    const onSelectPreset = selectedItem => {
        if (selectedItem && selectedItem['address']) {
            setWard(selectedItem['address']['ward']);
            setLine1(selectedItem['address']['line1']);
            setLine2(selectedItem['address']['line2']);
            setTown(selectedItem['address']['town']);
            setCounty(selectedItem['address']['county']);
            setCountry(selectedItem['address']['country']);
            setPostcode(selectedItem['address']['postcode']);
            setWhat3words(selectedItem['address']['what3words']);
        }

    };
    // useEffect(() => {props.onSelect({what3words: what3words})}, [what3words]);
    // useEffect(() => {props.onSelect({ward: ward})}, [ward]);
    // useEffect(() => {props.onSelect({line1: line1})}, [line1]);
    // useEffect(() => {props.onSelect({line2: line2})}, [line2]);
    // useEffect(() => {props.onSelect({town: town})}, [town]);
    // useEffect(() => {props.onSelect({postcode: postcode})}, [postcode]);
    // useEffect(() => {props.onSelect({country: country})}, [country]);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        props.onSelect({
            ward: ward,
            line1: line1,
            line2: line2,
            town: town,
            county: county,
            country: country,
            postcode: postcode,
            what3words: what3words
        })
    }, [what3words, ward, line1, line2, town, county, country, postcode]);


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
                        <Typography className={classes.heading}>{props.label} - {line1}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div>
                            <TextFieldUncontrolled
                                id={"what3words"}
                                label={"what3words"}
                                value={what3words}
                                onChange={e => {
                                    setWhat3words(e.target.value)
                                }}
                            />
                            <TextFieldUncontrolled
                                id={"ward"}
                                label={"Ward"}
                                value={ward}
                                onChange={e => {
                                    setWard(e.target.value)
                                }}
                                //onSelect={onEditAddress}
                            />
                            <TextFieldUncontrolled
                                id={"line1"}
                                label={"Line one"}
                                value={line1}
                                onChange={e => {
                                    setLine1(e.target.value)
                                }}
                            />
                            <TextFieldUncontrolled
                                id={"line2"}
                                label={"Line two"}
                                value={line2}
                                onChange={e => {
                                    setLine2(e.target.value)
                                }}
                            />
                            <TextFieldUncontrolled
                                id={"town"}
                                label={"Town"}
                                value={town}
                                onChange={e => {
                                    setTown(e.target.value)
                                }}
                            />
                            <TextFieldUncontrolled
                                id={"county"}
                                label={"County"}
                                value={county}
                                onChange={e => {
                                    setCounty(e.target.value)
                                }}
                            />
                            <TextFieldUncontrolled
                                id={"postcode"}
                                label={"Postcode"}
                                value={postcode}
                                onChange={e => {
                                    setPostcode(e.target.value)
                                }}
                            />
                            <TextFieldUncontrolled
                                id={"county"}
                                label={"Country"}
                                value={country}
                                onChange={e => {
                                    setCountry(e.target.value)
                                }}
                            />
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        )
}
