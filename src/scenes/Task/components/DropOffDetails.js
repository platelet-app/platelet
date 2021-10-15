import React from "react";
import Grid from "@mui/material/Grid";
import LocationDetailAndSelector from "./LocationDetailAndSelector";
import PropTypes from "prop-types";
import { Divider, Paper, Typography } from "@mui/material";
import { dialogCardStyles } from "../styles/DialogCompactStyles";

function DropOffDetails(props) {
    const classes = dialogCardStyles();

    return (
        <Paper className={classes.root}>
            <Grid
                container
                direction={"column"}
                justify={"flex-start"}
                spacing={1}
            >
                <Grid item>
                    <Grid container direction={"row"} justify={"space-between"}>
                        <Grid item>
                            <Typography variant={"h6"}>Deliver to</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider />
                </Grid>
                <Grid item>
                    <LocationDetailAndSelector
                        onSelectPreset={props.onSelectDropOffPreset}
                        onClear={props.onClearDropOffLocation}
                        onChange={(v) =>
                            props.onChange(
                                props.location ? props.location.id : null,
                                v
                            )
                        }
                        onEditPreset={props.onEditPreset}
                        location={props.location}
                        displayPresets={true}
                        label={"Deliver"}
                        showContact={props.showContact}
                    />
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
