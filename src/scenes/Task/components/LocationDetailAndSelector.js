import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types"
import Button from "@material-ui/core/Button";

function LocationDetailAndSelector(props) {
    return (
        <Grid container direction={"row"} justify={"space-between"}>
            <Grid item>
                <Typography>{props.label}</Typography>
            </Grid>
            <Grid item>
                <Button onClick={() => {}}>Choose</Button>
            </Grid>
        </Grid>
    )

}

LocationDetailAndSelector.propTypes = {
    label: PropTypes.string
}

LocationDetailAndSelector.propDefaults = {
    label: ""
}

export default LocationDetailAndSelector;
