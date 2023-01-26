import { TextField, Stack, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import PropTypes from "prop-types";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { useTheme } from "@mui/styles";
import _ from "lodash";

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
        setState(initialState);
        props.onCancel();
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
                {Object.entries(addressFields).map(([key, label]) => (
                    <TextField
                        key={key}
                        fullWidth
                        inputProps={{
                            "aria-label": label,
                        }}
                        label={label}
                        value={state[key]}
                        onChange={(e) => {
                            const { value } = e.target;
                            setState((prevState) => ({
                                ...prevState,
                                [key]: value,
                            }));
                        }}
                    />
                ))}
                {Object.entries(contactFields).map(([key, label]) => (
                    <TextFieldUncontrolled
                        key={key}
                        fullWidth
                        tel={key === "telephoneNumber"}
                        inputProps={{
                            "aria-label": label,
                        }}
                        label={label}
                        value={state.contact ? state.contact[key] : ""}
                        onChange={(e) => {
                            const { value } = e.target;
                            setState((prevState) => ({
                                ...prevState,
                                contact: {
                                    ...prevState.contact,
                                    [key]: value,
                                },
                            }));
                        }}
                    />
                ))}
            </Stack>
        </ConfirmationDialog>
    );
}

PopOutLocationSelectorForm.propTypes = {
    label: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    onConfirmation: PropTypes.func,
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
    location: null,
    onCancel: () => {},
    onConfirmation: () => {},
};

export default PopOutLocationSelectorForm;
