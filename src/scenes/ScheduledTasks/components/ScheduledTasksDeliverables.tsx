import React from "react";

import DeliverableGridSelect from "../../Deliverables/DeliverableGridSelect";
import { Stack, Typography } from "@mui/material";
import * as models from "../../../models";

type DeliverableDetailsProps = {
    onChange: (value: models.DeliverableType) => void;
    onDelete: (value: string) => void;
};

export const ScheduledTaskDeliverables: React.FC<DeliverableDetailsProps> = ({
    onChange,
    onDelete,
}) => {
    return (
        <Stack>
            <Typography variant="h6">What is being delivered?</Typography>
            <DeliverableGridSelect onDelete={onDelete} onChange={onChange} />
        </Stack>
    );
};

export default ScheduledTaskDeliverables;
