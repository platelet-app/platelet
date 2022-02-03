import { Stack, Typography } from "@mui/material";
import React from "react";
import { ContactForm } from "../../../components/ContactForm";
import PrioritySelect from "../../Task/components/PrioritySelect";

export const CallerDetails = ({
    values,
    onChangeContact,
    onChangePriority,
}) => {
    const [state, setState] = React.useState({
        name: "",
        telephoneNumber: "",
        email: "",
    });
    return (
        <Stack spacing={1}>
            <Typography variant="h6">
                What are their contact details?
            </Typography>
            <ContactForm
                values={state}
                onChange={(value) => {
                    setState((prevState) => ({ ...prevState, ...value }));
                    onChangeContact(value);
                }}
            />
            <Typography variant="h6">What is the priority?</Typography>
            <PrioritySelect
                priority={values.priority}
                onSelect={onChangePriority}
            />
        </Stack>
    );
};
