import { Stack } from "@mui/material";
import React from "react";
import LocationDetailsPanel from "../../sharedTaskComponents/LocationDetailsPanel";
import * as models from "../../../models";
import { useSelector } from "react-redux";
import { getWhoami } from "../../../redux/Selectors";

type ScheduledTaskOverviewLocationsProps = {
    scheduledTask: models.ScheduledTask;
};

const ScheduledTaskOverviewLocations: React.FC<
    ScheduledTaskOverviewLocationsProps
> = ({ scheduledTask }) => {
    const whoami = useSelector(getWhoami);
    const isAdmin = whoami?.roles.includes(models.Role.ADMIN);
    return (
        <Stack spacing={2}>
            <LocationDetailsPanel
                hasFullPermissionsOverride={isAdmin}
                locationKey="pickUpLocation"
                taskModel={models.ScheduledTask}
                taskId={scheduledTask.id}
            />
            <LocationDetailsPanel
                hasFullPermissionsOverride={isAdmin}
                locationKey="dropOffLocation"
                taskModel={models.ScheduledTask}
                taskId={scheduledTask.id}
            />
        </Stack>
    );
};

export default ScheduledTaskOverviewLocations;
