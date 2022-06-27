import { FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import React from "react";
import ClearButtonWithConfirmation from "../../../components/ClearButtonWithConfirmation";
import { ContactForm } from "../../../components/ContactForm";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";

export const CallerDetails = ({
    onChangeContact,
    onChangeLocation,
    establishmentSameAsPickup,
    onChangeEstablishmentSameAsPickup,
}) => {
    const [state, setState] = React.useState({
        name: "",
        telephoneNumber: "",
        email: "",
        establishment: null,
    });

    const handleSelectLocation = (location) => {
        onChangeLocation(location);
        if (
            !state.telephoneNumber &&
            location &&
            location.contact &&
            location.contact.telephoneNumber
        ) {
            setState((prevState) => ({
                ...prevState,
                establishment: location,
                telephoneNumber: location.contact.telephoneNumber,
            }));
        } else if (
            state.telephoneNumber &&
            !location &&
            state.establishment &&
            state.establishment.contact &&
            state.establishment.contact.telephoneNumber ===
                state.telephoneNumber
        ) {
            setState((prevState) => ({
                ...prevState,
                establishment: null,
                telephoneNumber: "",
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                establishment: location,
            }));
        }
    };

    return (
        <Stack spacing={1}>
            <Typography variant="h6">
                What are their contact details?
            </Typography>
            {state.establishment ? (
                <Stack direction="column" spacing={1}>
                    <Stack
                        justifyContent="space-between"
                        alignItems="center"
                        direction="row"
                    >
                        <Typography>{state.establishment.name}</Typography>
                        <ClearButtonWithConfirmation
                            onClear={() => handleSelectLocation(null)}
                        >
                            <Typography>Clear the location?</Typography>
                        </ClearButtonWithConfirmation>
                    </Stack>
                    <FormControlLabel
                        labelPlacement="start"
                        checked={establishmentSameAsPickup}
                        onChange={onChangeEstablishmentSameAsPickup}
                        control={<Switch defaultChecked />}
                        label="Same as pick up?"
                        aria-label="toggle same as pick up"
                    />
                </Stack>
            ) : (
                <FavouriteLocationsSelect
                    label="Select establishment"
                    onSelect={handleSelectLocation}
                />
            )}
            <ContactForm
                values={state}
                italicTel={
                    state.establishment &&
                    state.establishment.contact &&
                    state.establishment.contact.telephoneNumber &&
                    state.telephoneNumber ===
                        state.establishment.contact.telephoneNumber
                }
                onChange={(value) => {
                    setState((prevState) => ({ ...prevState, ...value }));
                    onChangeContact(value);
                }}
            />
        </Stack>
    );
};
