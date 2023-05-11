import { Stack } from "@mui/material";
import React from "react";
import LocationDetailsPanel from "../../../components/LocationDetailsPanel";
import * as models from "../../../models";

type ScheduledTaskOverviewLocationsProps = {
    scheduledTask: models.ScheduledTask;
};

const ScheduledTaskOverviewLocations: React.FC<
    ScheduledTaskOverviewLocationsProps
> = ({ scheduledTask }) => {
    return (
        <Stack spacing={2}>
            <LocationDetailsPanel
                hasFullPermissionsOverride
                locationKey="pickUpLocation"
                taskModel={models.ScheduledTask}
                taskId={scheduledTask.id}
            />
            <LocationDetailsPanel
                hasFullPermissionsOverride
                locationKey="dropOffLocation"
                taskModel={models.ScheduledTask}
                taskId={scheduledTask.id}
            />
        </Stack>
    );
};

export default ScheduledTaskOverviewLocations;
