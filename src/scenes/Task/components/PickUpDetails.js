import Grid from "@material-ui/core/Grid";
import LocationDetailAndSelector from "./LocationDetailAndSelector";
import LabelItemPair from "../../../components/LabelItemPair";
import TimePicker from "./TimePicker";
import React from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
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
                spacing={3}
            >
                <Grid item>
                    <LocationDetailAndSelector
                        onSelectPreset={props.onSelectPickupPreset}
                        onChange={props.onChange}
                        onEditPreset={props.onEditPreset}
                        onClear={onClearPickUpLocation}
                        location={props.location}
                        displayPresets={true}
                        label={"Pick up"}
                        showContact={props.showContact}
                    />
                </Grid>
                <Grid item>
                    <LabelItemPair label={"Time picked up"}>
                        <TimePicker
                            onChange={props.onChangeTimePickedUp}
                            label={"Mark picked up"}
                            time={props.time}
                        />
                    </LabelItemPair>
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
