import React from "react";

import DeliverableGridSelect from "../../Deliverables/DeliverableGridSelect";
import { Stack, Typography } from "@mui/material";

export const DeliverableDetails = ({ onChange, onDelete }) => {
    return (
        <Stack>
            <Typography variant="h6">What is being delivered?</Typography>
            <DeliverableGridSelect onDelete={onDelete} onChange={onChange} />
        </Stack>
    );
};
