import { Stack, Typography } from "@mui/material";
import React from "react";
import { ContactForm } from "../../../components/ContactForm";
import EstablishmentDetails from "../../sharedTaskComponents/EstablishmentDetails";
import * as models from "../../../models";

type ScheduledTaskCallerDetailsProps = {
    contact: { name: string; telephoneNumber: string };
    establishment: models.Location | null;
    onChangeContact: (value: { name: string; telephoneNumber: string }) => void;
    onChangeEstablishment: (value: models.Location | null) => void;
};

const ScheduledTaskCallerDetails: React.FC<ScheduledTaskCallerDetailsProps> = ({
    contact,
    establishment,
    onChangeContact,
    onChangeEstablishment,
}) => {
    return (
        <Stack spacing={1}>
            <Typography variant="h6">
                What are their contact details?
            </Typography>
            <EstablishmentDetails
                value={establishment}
                onSelect={onChangeEstablishment}
            />
            <ContactForm
                values={contact}
                italicTel={
                    contact.telephoneNumber ===
                    establishment?.contact?.telephoneNumber
                }
                onChange={(value) => {
                    onChangeContact(value);
                }}
            />
        </Stack>
    );
};

export default ScheduledTaskCallerDetails;
