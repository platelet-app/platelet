import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types"
import LabelItemPair from "../../../components/LabelItemPair";
import ClickableTextField from "../../../components/ClickableTextField";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";



function LocationDetailAndSelector(props) {
    const {
        what3words,
        ward,
        line1,
        line2,
        town,
        county,
        postcode
    } = props.location && props.location.address ? props.location.address : {
        what3words: null,
        ward: null,
        line1: null,
        line2: null,
        town: null,
        county: null,
        postcode: null
    };

    const protectedLocation = props.location ? props.location.protected : false;

    return (

        <Grid container direction={"column"}>
            <Grid item>
                <Grid container direction={"row"} justify={"space-between"}>
                    <Grid item>
                        <Typography>{props.label}</Typography>
                    </Grid>
                    <Grid item>
                        <FavouriteLocationsSelect label={props.label} onSelect={props.onSelectPreset}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <LabelItemPair label={"w3w"}>
                    <ClickableTextField label={"w3w"} disabled={protectedLocation} value={what3words}/>
                </LabelItemPair>
                <LabelItemPair label={"Ward"}>
                    <ClickableTextField label="ward" disabled={protectedLocation} value={ward}/>
                </LabelItemPair>
                <LabelItemPair label={"Line1"}>
                    <ClickableTextField label={"line1"} disabled={protectedLocation} value={line1}/>
                </LabelItemPair>
                <LabelItemPair label={"Line2"}>
                    <ClickableTextField label={"line2"} disabled={protectedLocation} value={line2}/>
                </LabelItemPair>
                <LabelItemPair label={"Town"}>
                    <ClickableTextField label={"town"} disabled={protectedLocation} value={town}/>
                </LabelItemPair>
                <LabelItemPair label={"County"}>
                    <ClickableTextField label={"county"} disabled={protectedLocation} value={county}/>
                </LabelItemPair>
                <LabelItemPair label={"Postcode"}>
                    <ClickableTextField label={"postcode"} disabled={protectedLocation} value={postcode}/>
                </LabelItemPair>


            </Grid>
        </Grid>
    )

}

LocationDetailAndSelector.propTypes = {
    label: PropTypes.string,
    location: PropTypes.object,
    onSelectPreset: PropTypes.func
}

LocationDetailAndSelector.propDefaults = {
    label: "",
    location: {
        address: {
            what3words: null,
            ward: null,
            line1: null,
            line2: null,
            town: null,
            county: null,
            postcode: null
        }
    },
    onSelectPreset: () => {
    }
}

export default LocationDetailAndSelector;
