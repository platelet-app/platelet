import { PaddedPaper } from "../../../styles/common";
import Grid from "@material-ui/core/Grid";
import LocationDetailAndSelector from "./LocationDetailAndSelector";
import LabelItemPair from "../../../components/LabelItemPair";
import TimePicker from "./TimePicker";
import React from "react";
import PropTypes from "prop-types";
import {
    updateTaskDropoffTimePrefix,
    updateTaskDropoffTimeRequest,
} from "../../../redux/tasks/TasksActions";
import {
    addNewDropoffLocationAndSetTaskRequest,
    setTaskDropoffDestinationRequest,
    unsetTaskDropoffDestinationRequest,
    updateDropoffLocationAndUpdateTaskRequest,
} from "../../../redux/taskDestinations/TaskDestinationsActions";
import { useDispatch, useSelector } from "react-redux";
import { createPostingSelector } from "../../../redux/LoadingSelectors";
import { Paper } from "@material-ui/core";
import { dialogCardStyles } from "../styles/DialogCompactStyles";

function DropOffDetails(props) {
    const dispatch = useDispatch();
    const dropoffPostingSelector = createPostingSelector([
        updateTaskDropoffTimePrefix,
    ]);
    const isPostingDropoffTime = useSelector((state) =>
        dropoffPostingSelector(state)
    );

    const classes = dialogCardStyles();

    function onChangeTimeDropoff(value) {
        if (value || value === null)
            dispatch(
                updateTaskDropoffTimeRequest(props.taskUUID, {
                    time_dropped_off: value,
                })
            );
    }

    function onChangeDropoffLocation(value, makeNew = false) {
        if (props.location) {
            if (makeNew) {
                dispatch(
                    addNewDropoffLocationAndSetTaskRequest(
                        props.taskUUID,
                        value
                    )
                );
            } else {
                dispatch(
                    updateDropoffLocationAndUpdateTaskRequest(
                        props.taskUUID,
                        value
                    )
                );
            }
        } else {
            dispatch(
                addNewDropoffLocationAndSetTaskRequest(props.taskUUID, value)
            );
        }
    }

    function onClearDropoffLocation() {
        if (props.location) {
            dispatch(unsetTaskDropoffDestinationRequest(props.taskUUID));
        }
    }

    function onSelectDropoffFromSaved(location) {
        const locationUUID = location.uuid;
        if (locationUUID) {
            dispatch(
                setTaskDropoffDestinationRequest(props.taskUUID, locationUUID)
            );
        }
    }
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
                        onSelectPreset={onSelectDropoffFromSaved}
                        onChange={onChangeDropoffLocation}
                        onClear={onClearDropoffLocation}
                        onEditPreset={(value) =>
                            onChangeDropoffLocation(value, true)
                        }
                        location={props.location}
                        displayPresets={true}
                        label={"Deliver"}
                    />
                </Grid>
                <Grid item>
                    <LabelItemPair label={"Time delivered"}>
                        <TimePicker
                            onChange={onChangeTimeDropoff}
                            disabled={
                                isPostingDropoffTime || props.disableTimeButton
                            }
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
};

DropOffDetails.defaultProps = {
    time: "",
    disableTimeButton: false,
};

export default DropOffDetails;
