import { Stack, Typography } from "@mui/material";
import React from "react";
import { ContactForm } from "../../../components/ContactForm";
import EstablishmentDetails from "./EstablishmentDetails";

export const CallerDetails = ({
    onChangeContact,
    onChangeLocation,
    establishmentSameAsPickup,
    onChangeEstablishmentSameAsPickUp,
}) => {
    const [state, setState] = React.useState({
        name: "",
        telephoneNumber: "",
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
            onChangeContact({
                name: state.name,
                telephoneNumber: location.contact.telephoneNumber,
            });
        } else if (
            state.telephoneNumber &&
            !location &&
            state.establishment &&
            state.establishment.contact &&
            state.establishment.contact.telephoneNumber ===
                state.telephoneNumber
        ) {
            // if we're clearing the establishment and the number didn't change
            // clear the number too
            setState((prevState) => ({
                ...prevState,
                establishment: null,
                telephoneNumber: "",
            }));
            onChangeContact({
                name: state.name,
                telephoneNumber: "",
            });
        } else {
            // otherwise leave the contact number alone
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
            <EstablishmentDetails
                sameAsPickUp={establishmentSameAsPickup}
                value={state.establishment}
                onSelect={handleSelectLocation}
                onChangeEstablishmentSameAsPickUp={
                    onChangeEstablishmentSameAsPickUp
                }
            />
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
