import React, {useEffect, useRef} from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavouriteLocationsSelect from "./FavouriteLocationsSelect";
import { TextFieldUncontrolled }from "./TextFields";
import Grid from "@material-ui/core/Grid";
import { useState } from 'react';
import Button from "@material-ui/core/Button"

export default function AddressDetailsCollapsible(props){
    const [what3words, setWhat3words] = useState(props.address ? props.address.what3words || "" : "");
    const [ward, setWard] = useState(props.address ? props.address.ward || "" : "");
    const [line1, setLine1] = useState(props.address ? props.address.line1 || "" :  "");
    const [line2, setLine2] = useState(props.address ? props.address.line2 || "" : "");
    const [town, setTown] = useState(props.address ? props.address.town || "" : "");
    const [county, setCounty] = useState(props.address ? props.address.county || "" : "");
    const [country, setCountry] = useState(props.address ? props.address.country || "" : "");
    const [postcode, setPostcode] = useState(props.address ? props.address.country || "" : "");
    const firstUpdate = useRef(true);
    const [presetMode, setPresetMode] = useState(false);


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
        setPresetMode(false);

    };

    useEffect(() => {
        // We don't need it to run the first time
        if (firstUpdate.current) {
            firstUpdate.current = false;
        } else {
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
        }
    }, [what3words, ward, line1, line2, town, county, country, postcode]);


        let presetSelect = <></>;
        if (!props.disabled) {
            presetSelect = presetMode ?
                <FavouriteLocationsSelect id="addressSelect" suggestions={props.suggestions}
                                          onSelect={onSelectPreset}
                                          disabled={props.disabled}/> : <></>;
        }

        const presetModeButton =
            <Button
                onClick={() => {setPresetMode(!presetMode)}}
                variant={"contained"}
                color={"primary"}
            >
                {presetMode ? "Cancel" : "Saved locations"}
            </Button>

        return (
                <Grid container spacing={1} direction={"column"} alignItems={"flex-start"} justify={"center"}>
                    <Grid item>
                        {presetModeButton}
                    </Grid>
                    <Grid item>
                        {presetSelect}
                    </Grid>
                    <Grid item>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="address-content"
                        id="address-header"
                    >
                        <Typography>{props.label ? props.label + " - " + line1 : line1}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container spacing={0} direction={"column"} alignItems={"flex-start"} justify={"center"}>
                            <Grid item>
                            <TextFieldUncontrolled
                                id={"what3words"}
                                label={"what3words"}
                                value={what3words}
                                onChange={e => {
                                    setWhat3words(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                id={"ward"}
                                label={"Ward"}
                                value={ward}
                                onChange={e => {
                                    setWard(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                id={"line1"}
                                label={"Line one"}
                                value={line1}
                                onChange={e => {
                                    setLine1(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                id={"line2"}
                                label={"Line two"}
                                value={line2}
                                onChange={e => {
                                    setLine2(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                id={"town"}
                                label={"Town"}
                                value={town}
                                onChange={e => {
                                    setTown(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                id={"county"}
                                label={"County"}
                                value={county}
                                onChange={e => {
                                    setCounty(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                id={"postcode"}
                                label={"Postcode"}
                                value={postcode}
                                onChange={e => {
                                    setPostcode(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                id={"county"}
                                label={"Country"}
                                value={country}
                                onChange={e => {
                                    setCountry(e.target.value)
                                }}
                            />
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                    </Grid>
                </Grid>
        )
}
