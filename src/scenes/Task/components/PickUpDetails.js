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
import {
    updateTaskPickupTimePrefix,
    updateTaskPickupTimeRequest,
} from "../../../redux/tasks/TasksActions";
import { createPostingSelector } from "../../../redux/LoadingSelectors";
import { Paper } from "@material-ui/core";
import { dialogCardStyles } from "../styles/DialogCompactStyles";

function PickUpDetails(props) {
    const dispatch = useDispatch();
    const pickupPostingSelector = createPostingSelector([
        updateTaskPickupTimePrefix,
    ]);
    const isPostingPickupTime = useSelector((state) =>
        pickupPostingSelector(state)
    );
    const classes = dialogCardStyles();

    function onSelectPickupFromSaved(location) {
        const locationUUID = location.uuid;
        if (locationUUID) {
            dispatch(
                setTaskPickupDestinationRequest(props.taskUUID, locationUUID)
            );
        }
    }

    function onClearPickupLocation() {
        if (props.location) {
            dispatch(unsetTaskPickupDestinationRequest(props.taskUUID));
        }
    }

    function onChangePickupLocation(value, makeNew = false) {
        if (props.location) {
            if (makeNew) {
                debugger;
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

    function onChangeTimePickedUp(value) {
        if (value || value === null)
            dispatch(
                updateTaskPickupTimeRequest(props.taskUUID, {
                    time_picked_up: value,
                })
            );
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
                        onSelectPreset={onSelectPickupFromSaved}
                        onChange={onChangePickupLocation}
                        onEditPreset={(value) =>
                            onChangePickupLocation(value, true)
                        }
                        onClear={onClearPickupLocation}
                        location={props.location}
                        displayPresets={true}
                        label={"Pick up"}
                    />
                </Grid>
                <Grid item>
                    <LabelItemPair label={"Time picked up"}>
                        <TimePicker
                            onChange={onChangeTimePickedUp}
                            disabled={isPostingPickupTime}
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
