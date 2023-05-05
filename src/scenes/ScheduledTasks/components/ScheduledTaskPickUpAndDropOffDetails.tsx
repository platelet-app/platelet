import PopOutLocationSelector from "../../GuidedSetup/components/PopOutLocationSelector";
import * as models from "../../../models";
import { Divider, Stack, Typography } from "@mui/material";
import React from "react";

type PickUpAndDeliverLocationProps = {
    onChange: (
        key: "pickUpLocation" | "dropOffLocation",
        value: models.Location | null
    ) => void;
    reset: boolean;
};

const ScheduledTaskPickUpAndDropOffDetails: React.FC<
    PickUpAndDeliverLocationProps
> = ({ onChange, reset }) => {
    const onSetPickUpLocation = (location: models.Location) => {
        onChange("pickUpLocation", location);
    };
    const onClearPickUpLocation = () => {
        onChange("pickUpLocation", null);
    };
    const onSetDropOffLocation = (location: models.Location) => {
        onChange("dropOffLocation", location);
    };
    const onClearDropOffLocation = () => {
        onChange("dropOffLocation", null);
    };

    return (
        <Stack divider={<Divider />} spacing={1}>
            <Typography variant="h6">Where from?</Typography>
            <PopOutLocationSelector
                key={`${reset}p`}
                label="pick-up"
                onChange={onSetPickUpLocation}
                onClear={onClearPickUpLocation}
            />
            <Typography variant="h6">Where to?</Typography>
            <PopOutLocationSelector
                key={`${reset}d`}
                label="deliver"
                onChange={onSetDropOffLocation}
                onClear={onClearDropOffLocation}
            />
        </Stack>
    );
};

export default ScheduledTaskPickUpAndDropOffDetails;
