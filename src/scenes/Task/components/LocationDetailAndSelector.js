import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types"
import Button from "@material-ui/core/Button";
import {ClickableTextField} from "../../../components/ClickableTextField";

function LocationDetailAndSelector(props) {

    const {
        what3words,
        ward,
        line1,
        line2,
        town,
        county,
        postcode
    } = props.location.address

    return (

        <Grid container direction={"column"}>
            <Grid item>
        <Grid container direction={"row"} justify={"space-between"}>
            <Grid item>
                <Typography>{props.label}</Typography>
            </Grid>
            <Grid item>
                <Button onClick={() => {}}>Choose</Button>
            </Grid>
        </Grid>
            </Grid>
            <Grid item>
                <ClickableTextField value={what3words}/>
                <ClickableTextField value={ward}/>
                <ClickableTextField value={line1}/>
                <ClickableTextField value={line2}/>
                <ClickableTextField value={town}/>
                <ClickableTextField value={county}/>
                <ClickableTextField value={postcode}/>


            </Grid>
        </Grid>
    )

}

LocationDetailAndSelector.propTypes = {
    label: PropTypes.string,
    location: PropTypes.object
}

LocationDetailAndSelector.propDefaults = {
    label: ""
}

export default LocationDetailAndSelector;
