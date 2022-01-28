import { Stack, Typography } from "@mui/material";
import React from "react";
import { ContactForm } from "../../components/ContactForm";
import PrioritySelect from "../Task/components/PrioritySelect";

export const Step1 = ({ values, onChangeContact, onChangePriority }) => {
    return (
        <Stack spacing={1}>
            <Typography variant="h6">
                What are their contact details?
            </Typography>
            <ContactForm
                values={values.requesterContact}
                onChange={onChangeContact}
            />
            <Typography variant="h6">What's the priority?</Typography>
            <PrioritySelect
                priority={values.priority}
                onSelect={onChangePriority}
            />
        </Stack>
    );
};
