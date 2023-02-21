import { DateTimePicker } from "@mui/lab";
import * as models from "../../../models";
import { Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { ContactForm } from "../../../components/ContactForm";
import EstablishmentDetails from "./EstablishmentDetails";

type CallerDetailType = {
    onChangeContact: (contact: any) => void;
    onChangeLocation: (location: any) => void;
    establishmentSameAsPickup: boolean;
    onChangeEstablishmentSameAsPickUp: (
        establishmentSameAsPickup: boolean
    ) => void;
    timeOfCall: Date;
    onChangeTimeOfCall: (timeOfCall: Date | null) => void;
    onInvalidTimeOfCall: (error: any) => void;
};

type StateType = {
    name: string;
    telephoneNumber: string;
    establishment: null | models.Location;
};

export const CallerDetails: React.FC<CallerDetailType> = ({
    onChangeContact,
    onChangeLocation,
    establishmentSameAsPickup,
    onChangeEstablishmentSameAsPickUp,
    onChangeTimeOfCall,
    timeOfCall,
    onInvalidTimeOfCall,
}) => {
    const [state, setState] = React.useState<StateType>({
        name: "",
        telephoneNumber: "",
        establishment: null,
    });

    const handleSelectLocation = (location: models.Location) => {
        onChangeLocation(location);
        if (
            !state.telephoneNumber &&
            location &&
            location.contact &&
            location.contact.telephoneNumber
        ) {
            setState((prevState) => ({
                ...prevState,
                establishment: location || null,
                telephoneNumber: location.contact?.telephoneNumber || "",
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
            <DateTimePicker
                label="Time of call"
                ampm={false}
                renderInput={(params) => {
                    const { inputProps } = params;
                    return (
                        <TextField
                            {...params}
                            inputProps={{
                                ...inputProps,
                                "aria-label": "Time of call",
                            }}
                        />
                    );
                }}
                value={timeOfCall}
                onChange={onChangeTimeOfCall}
                onError={onInvalidTimeOfCall}
            />
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
                    state.telephoneNumber ===
                    state.establishment?.contact?.telephoneNumber
                }
                onChange={(value) => {
                    setState((prevState) => ({ ...prevState, ...value }));
                    onChangeContact(value);
                }}
            />
        </Stack>
    );
};
