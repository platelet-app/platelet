import Grid from "@material-ui/core/Grid";
import LocationDetailAndSelector from "./LocationDetailAndSelector";
import LabelItemPair from "../../../components/LabelItemPair";
import TimePicker from "./TimePicker";
import React from "react";
import {
    addNewPickupLocationAndSetTaskRequest,
    setTaskPickupDestinationRequest,
    unsetTaskPickupDestinationRequest,
    updatePickupLocationAndUpdateTaskRequest,
} from "../../../redux/taskDestinations/TaskDestinationsActions";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { createPostingSelector } from "../../../redux/LoadingSelectors";
import { Paper } from "@material-ui/core";
import { dialogCardStyles } from "../styles/DialogCompactStyles";

function PickUpDetails(props) {
    const dispatch = useDispatch();
    const classes = dialogCardStyles();

    function onClearPickupLocation() {
        if (props.location) {
            dispatch(unsetTaskPickupDestinationRequest(props.taskUUID));
        }
    }

    function onChangePickupLocation(value, makeNew = false) {
        if (props.location) {
            if (makeNew) {
                dispatch(
                    addNewPickupLocationAndSetTaskRequest(props.taskUUID, value)
                );
            } else {
                dispatch(
                    updatePickupLocationAndUpdateTaskRequest(
                        props.taskUUID,
                        value
                    )
                );
            }
        } else {
            dispatch(
                addNewPickupLocationAndSetTaskRequest(props.taskUUID, value)
            );
        }
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
                        onClear={onClearPickupLocation}
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
