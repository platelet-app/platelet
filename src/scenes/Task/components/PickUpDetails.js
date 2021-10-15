import Grid from "@material-ui/core/Grid";
import LocationDetailAndSelector from "./LocationDetailAndSelector";
import React from "react";
import PropTypes from "prop-types";
import { Divider, Paper, Typography } from "@material-ui/core";
import { dialogCardStyles } from "../styles/DialogCompactStyles";

function PickUpDetails(props) {
    const classes = dialogCardStyles();

    function onClearPickUpLocation() {
        props.onClearPickUpLocation();
    }

    return (
        <Paper className={classes.root}>
            <Grid
                container
                direction={"column"}
                justify={"space-between"}
                spacing={1}
            >
                <Grid item>
                    <Grid container direction={"row"} justify={"space-between"}>
                        <Grid item>
                            <Typography variant={"h6"}>Collect from</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider />
                </Grid>
                <Grid item>
                    <LocationDetailAndSelector
                        onSelectPreset={props.onSelectPickupPreset}
                        onChange={(v) =>
                            props.onChange(
                                props.location ? props.location.id : null,
                                v
                            )
                        }
                        onEditPreset={props.onEditPreset}
                        onClear={onClearPickUpLocation}
                        location={props.location}
                        displayPresets={true}
                        label={"Pick up"}
                        showContact={props.showContact}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}

PickUpDetails.propTypes = {
    time: PropTypes.string,
    location: PropTypes.object,
    taskUUID: PropTypes.string.isRequired,
};

PickUpDetails.defaultProps = {
    time: "",
};

export default PickUpDetails;
