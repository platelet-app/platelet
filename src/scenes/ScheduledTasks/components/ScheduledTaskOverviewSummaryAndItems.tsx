import { Stack } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import * as models from "../../../models";
import { getWhoami } from "../../../redux/Selectors";
import DeliverableDetails from "../../sharedTaskComponents/DeliverableDetails";
import ScheduledTaskOverviewSummary from "./ScheduledTaskOverviewSummary";

type ScheduledTaskOverviewSummaryAndItemsProps = {
    scheduledTask: models.ScheduledTask;
};
const ScheduledTaskOverviewSummaryAndItems: React.FC<
    ScheduledTaskOverviewSummaryAndItemsProps
> = ({ scheduledTask }) => {
    const whoami = useSelector(getWhoami);
    const isAdmin = whoami?.roles.includes(models.Role.ADMIN);
    return (
        <Stack spacing={2}>
            <ScheduledTaskOverviewSummary scheduledTask={scheduledTask} />
            <DeliverableDetails
                taskModelType="ScheduledTask"
                taskId={scheduledTask.id}
                hasFullPermissionsOverride={isAdmin}
            />
        </Stack>
    );
};

export default ScheduledTaskOverviewSummaryAndItems;
