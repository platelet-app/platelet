import React from "react";
import * as models from "../../../models";
import PrioritySelect from "../../../components/PrioritySelect";
import { Stack, Typography } from "@mui/material";

type ScheduledTaskPriorityProps = {
    value: models.Priority | null;
    onChange: (value: models.Priority | null) => void;
};

const ScheduledTaskPriority: React.FC<ScheduledTaskPriorityProps> = ({
    value,
    onChange,
}) => {
    return (
        <Stack spacing={1}>
            <Typography variant="h6">What is the priority?</Typography>
            <PrioritySelect priority={value} onSelect={onChange} />
        </Stack>
    );
};

export default ScheduledTaskPriority;
