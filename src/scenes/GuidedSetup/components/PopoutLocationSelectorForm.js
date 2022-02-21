import { TextField, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import PropTypes from "prop-types";

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

    function updateStateFromProps() {
        if (props.location) setState({ ...initialState, ...props.location });
    }
    useEffect(updateStateFromProps, [props.location]);

    return (
        <ConfirmationDialog
            dialogTitle={props.label}
            onCancel={props.onCancel}
            onConfirmation={() => props.onConfirmation(state)}
            open={props.open}
        >
            <Stack sx={{ padding: 1, minWidth: 400 }} spacing={1}>
                {Object.entries(addressFields).map(([key, label]) => (
                    <TextField
                        key={key}
                        fullWidth
                        aria-label={label}
                        label={label}
                        value={state[key]}
                        onChange={(e) =>
                            setState((prevState) => ({
                                ...prevState,
                                [key]: e.target.value,
                            }))
                        }
                    />
                ))}
                {Object.entries(contactFields).map(([key, label]) => (
                    <TextField
                        key={key}
                        fullWidth
                        aria-label={label}
                        label={label}
                        value={state.contact[key]}
                        onChange={(e) =>
                            setState((prevState) => ({
                                ...prevState,
                                contact: {
                                    ...prevState.contact,
                                    [key]: e.target.value,
                                },
                            }))
                        }
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
