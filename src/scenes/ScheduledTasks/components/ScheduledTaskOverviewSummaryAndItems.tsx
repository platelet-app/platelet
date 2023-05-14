import { Stack } from "@mui/material";
import React from "react";
import * as models from "../../../models";
import DeliverableDetails from "../../sharedTaskComponents/DeliverableDetails";
import ScheduledTaskOverviewSummary from "./ScheduledTaskOverviewSummary";

type ScheduledTaskOverviewSummaryAndItemsProps = {
    scheduledTask: models.ScheduledTask;
};
const ScheduledTaskOverviewSummaryAndItems: React.FC<
    ScheduledTaskOverviewSummaryAndItemsProps
> = ({ scheduledTask }) => {
    return (
        <Stack spacing={2}>
            <ScheduledTaskOverviewSummary scheduledTask={scheduledTask} />
            <DeliverableDetails
                taskModelType="ScheduledTask"
                taskId={scheduledTask.id}
                hasFullPermissionsOverride
            />
        </Stack>
    );
};

export default ScheduledTaskOverviewSummaryAndItems;
