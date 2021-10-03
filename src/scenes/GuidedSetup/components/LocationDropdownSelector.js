import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { encodeUUID } from "../../../utilities";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';

const useStyles = makeStyles({
    root: {
        maxWidth: "350px",
    },
    button: {
        height: 9,
    },
    label: {
        maxWidth: "250px",
    },
    separator: {
        height: 10,
    },
});

function LocationDropdownSelector(props) {
    const classes = useStyles();

    const [value, setValue] = React.useState(new Date(Date.now()));

    const handleDateChange = (newValue) => {
        setValue(newValue);
    };

    const presetName =
        props.location && props.location.name ? props.location.name : "";
    const locationLink =
        props.location && props.location.uuid
            ? `/location/${encodeUUID(props.location.uuid)}`
            : "";

    return (
        <div className={classes.root}>
            <Grid item>
            <Grid
                container
                spacing={1}
                justify={"space-between"}
                alignItems={"center"}
                direction={"row"}
            >
                <Grid item>
                    <FavouriteLocationsSelect
                        label={props.label}
                        onSelect={(value) => props.onSelectPreset(value)}
                        customWidth={"380px"}
                    />
                </Grid>
                <Grid item>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label={"Date&Time picker"}
                            value={value}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            />
                    </LocalizationProvider>
                </Grid>
            </Grid>
        </Grid>
        </div>
    );
}

LocationDropdownSelector.propTypes = {
    label: PropTypes.string,
    location: PropTypes.object,
    onSelectPreset: PropTypes.func,
    className: PropTypes.string,
};

LocationDropdownSelector.defaultProps = {
    label: "",
    location: {
        address: {
            what3words: null,
            ward: null,
            line1: null,
            line2: null,
            town: null,
            county: null,
            postcode: null,
        },
        contact: {
            name: null,
            telephone_number: null,
            email_address: null,
        },
    },
    onSelectPreset: () => {},
};

export default LocationDropdownSelector;
