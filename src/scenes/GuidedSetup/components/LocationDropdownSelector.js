import React from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { encodeUUID } from "../../../utilities";

const useStyles = makeStyles({
    root: {
        maxWidth: "350px",
        marginBottom: "50px",
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

export const LocationDropdownSelector = (props) => {
    const classes = useStyles();

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
                        onSelect={(value) => props.onSelectLocation(value)}
                        customWidth={"380px"}
                    />
                </Grid>
            </Grid>
        </Grid>
        </div>
    );
}

LocationDropdownSelector.propTypes = {
    label: PropTypes.string,
    location: PropTypes.object,
    onSelectLocation: PropTypes.func,
    onSelectTime: PropTypes.func,
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
    onSelectLocation: () => {},
};
