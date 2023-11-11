import { TextField, Stack, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import PropTypes from "prop-types";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { useTheme } from "@mui/styles";
import _ from "lodash";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import { protectedFields } from "../../../apiConsts";

const initialState = {
    name: "",
    ward: "",
    line1: "",
    line2: "",
    town: "",
    county: "",
    postcode: "",
    contact: {
        telephoneNumber: "",
        emailAddress: "",
        name: "",
    },
    listed: 0,
};

const addressFields = {
    ward: "Ward",
    line1: "Line one",
    line2: "Line two",
    town: "Town",
    county: "County",
    country: "Country",
    postcode: "Postcode",
};

const contactFields = {
    name: "Name",
    telephoneNumber: "Telephone",
};

function PopOutLocationSelectorForm(props) {
    const [state, setState] = useState(initialState);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    function updateStateFromProps() {
        if (props.location) {
            setState(props.location);
        } else {
            setState(initialState);
        }
    }
    useEffect(updateStateFromProps, [props.location]);

    const checkDisabled = () => {
        return _.isEqual(state, initialState);
    };

    const handleCancel = () => {
        props.onCancel();
    };

    const handleSelect = (location) => {
        if (location) {
            setState(location);
        }
    };

    const handleChange = (e, key) => {
        const { value } = e.target;
        const rest = _.omit(state, protectedFields);
        setState({
            ...rest,
            name: "",
            listed: 0,
            [key]: value,
        });
    };

    const handleContactChange = (e, key) => {
        const { value } = e.target;
        const rest = _.omit(state, protectedFields);
        setState({
            ...rest,
            contact: {
                ...rest.contact,
                [key]: value,
            },
        });
    };

    return (
        <ConfirmationDialog
            fullScreen={isSm}
            dialogTitle={props.label}
            onCancel={handleCancel}
            disabled={checkDisabled()}
            onConfirmation={() => props.onConfirmation(state)}
            open={props.open}
        >
            <Stack
                sx={{ marginTop: 1, width: "100%", minWidth: isSm ? 0 : 400 }}
                spacing={1}
            >
                {props.showFavorites && (
                    <FavouriteLocationsSelect
                        label="Search a new location"
                        size="large"
                        online
                        onSelect={handleSelect}
                    />
                )}
                {Object.entries(addressFields).map(([key, label]) => {
                    return (
                        <TextField
                            key={key}
                            fullWidth
                            inputProps={{
                                "aria-label": label,
                            }}
                            label={label}
                            value={state[key]}
                            onChange={(e) => handleChange(e, key)}
                        />
                    );
                })}

                {Object.entries(contactFields).map(([key, label]) => {
                    return (
                        <TextFieldUncontrolled
                            key={key}
                            fullWidth
                            tel={key === "telephoneNumber"}
                            inputProps={{
                                "aria-label": label,
                            }}
                            label={label}
                            value={state.contact ? state.contact[key] : ""}
                            onChange={(e) => handleContactChange(e, key)}
                        />
                    );
                })}
            </Stack>
        </ConfirmationDialog>
    );
}

PopOutLocationSelectorForm.propTypes = {
    label: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    onConfirmation: PropTypes.func,
    showFavorites: PropTypes.bool,
    location: PropTypes.shape({
        name: PropTypes.string,
        ward: PropTypes.string,
        line1: PropTypes.string,
        line2: PropTypes.string,
        town: PropTypes.string,
        county: PropTypes.string,
        country: PropTypes.string,
        postcode: PropTypes.string,
        contact: PropTypes.shape({
            telephoneNumber: PropTypes.string,
            emailAddress: PropTypes.string,
            name: PropTypes.string,
        }),
    }),
};

PopOutLocationSelectorForm.defaultProps = {
    label: "",
    showFavorites: false,
    location: null,
    onCancel: () => {},
    onConfirmation: () => {},
};

export default PopOutLocationSelectorForm;
