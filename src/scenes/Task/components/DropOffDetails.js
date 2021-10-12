import { PaddedPaper } from "../../../styles/common";
import Grid from "@material-ui/core/Grid";
import LocationDetailAndSelector from "./LocationDetailAndSelector";
import LabelItemPair from "../../../components/LabelItemPair";
import TimePicker from "./TimePicker";
import React from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import { dialogCardStyles } from "../styles/DialogCompactStyles";

function DropOffDetails(props) {
    const classes = dialogCardStyles();

    return (
        <Paper className={classes.root}>
            <Grid
                container
                direction={"column"}
                justify={"flex-start"}
                spacing={3}
            >
                <Grid item>
                    <LocationDetailAndSelector
                        onSelectPreset={props.onSelectDropOffPreset}
                        onClear={props.onClearDropOffLocation}
                        onChange={props.onChange}
                        onEditPreset={props.onEditPreset}
                        location={props.location}
                        displayPresets={true}
                        label={"Deliver"}
                        showContact={props.showContact}
                    />
                </Grid>
                <Grid item>
                    <LabelItemPair label={"Time delivered"}>
                        <TimePicker
                            onChange={props.onChangeTimeDroppedOff}
                            disabled={props.disableTimeButton}
                            label={"Mark delivered"}
                            time={props.time}
                        />
                    </LabelItemPair>
                </Grid>
            </Grid>
        </Paper>
    );
}

DropOffDetails.propTypes = {
    time: PropTypes.string,
    location: PropTypes.object,
    taskUUID: PropTypes.string.isRequired,
    disableTimeButton: PropTypes.bool,
    onChangeTimeDroppedOff: PropTypes.func,
};

DropOffDetails.defaultProps = {
    time: "",
    disableTimeButton: false,
    onChangeTimeDroppedOff: () => {},
};

export default DropOffDetails;
