import React, {useEffect, useRef} from 'react';
import Accordian from '@material-ui/core/Accordion';
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
    const [postcode, setPostcode] = useState(props.address ? props.address.postcode || "" : "");
    const firstUpdate = useRef(true);
    const [presetMode, setPresetMode] = useState(false);


    const onSelectPreset = selectedItem => {
        props.onSelectPreset(selectedItem.uuid)
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
                                          label={props.label}
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
                <Accordian>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="address-content"
                    >
                        <Typography>{props.label ? props.label + " - " + line1 : line1}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={0} direction={"column"} alignItems={"flex-start"} justify={"center"}>
                            <Grid item>
                            <TextFieldUncontrolled
                                label={"what3words"}
                                value={what3words}
                                onChange={e => {
                                    setWhat3words(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                label={"Ward"}
                                value={ward}
                                onChange={e => {
                                    setWard(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                label={"Line one"}
                                value={line1}
                                onChange={e => {
                                    setLine1(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                label={"Line two"}
                                value={line2}
                                onChange={e => {
                                    setLine2(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                label={"Town"}
                                value={town}
                                onChange={e => {
                                    setTown(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                label={"County"}
                                value={county}
                                onChange={e => {
                                    setCounty(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                label={"Postcode"}
                                value={postcode}
                                onChange={e => {
                                    setPostcode(e.target.value)
                                }}
                            />
                            </Grid>
                            <Grid item>
                            <TextFieldUncontrolled
                                label={"Country"}
                                value={country}
                                onChange={e => {
                                    setCountry(e.target.value)
                                }}
                            />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordian>
                    </Grid>
                </Grid>
        )
}
