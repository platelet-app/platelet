import React from "react";
import Typography from "@mui/material/Typography";
import LocationDetailAndSelector from "../../Task/components/LocationDetailAndSelector";
import { Divider, Stack } from "@mui/material";
import PopOutLocationSelector from "./PopOutLocationSelector";

export const PickUpAndDeliverDetails = ({
    onSetPickUpLocation,
    onSetDropOffLocation,
    onClearPickUpLocation,
    onClearDropOffLocation,
}) => {
    return (
        <Stack spacing={1}>
            <Typography variant="h6">Where from?</Typography>
            <PopOutLocationSelector
                label="pick up"
                onChange={onSetPickUpLocation}
                onClear={onClearPickUpLocation}
            />
            <Divider />
            <Typography variant="h6">Where to?</Typography>
            <PopOutLocationSelector
                label="delivery"
                onChange={onSetDropOffLocation}
                onClear={onClearDropOffLocation}
            />
        </Stack>
    );
};
