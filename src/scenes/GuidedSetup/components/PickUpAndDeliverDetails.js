import React from "react";
import Typography from "@mui/material/Typography";
import LocationDetailAndSelector from "../../Task/components/LocationDetailAndSelector";
import { Divider, Stack } from "@mui/material";

export const PickUpAndDeliverDetails = ({
    values,
    onSelectPickUpLocation,
    onSelectDropOffLocation,
    onChangePickUpLocation,
    onChangeDropOffLocation,
    onClearPickUpLocation,
    onClearDropOffLocation,
}) => {
    return (
        <Stack spacing={1}>
            <Typography variant="h6">Where from?</Typography>
            <LocationDetailAndSelector
                onSelectPreset={onSelectPickUpLocation}
                label="pick up"
                onChange={onChangePickUpLocation}
                onClear={onClearPickUpLocation}
                onChangeContact={(values) =>
                    onChangePickUpLocation({ contact: values })
                }
                location={values.pickUpLocation}
                noLink
            />
            <Divider />
            <Typography variant="h6">Where to?</Typography>
            <LocationDetailAndSelector
                onSelectPreset={onSelectDropOffLocation}
                label="drop off"
                onChange={onChangeDropOffLocation}
                onClear={onClearDropOffLocation}
                onChangeContact={(values) =>
                    onChangeDropOffLocation({ contact: values })
                }
                location={values.dropOffLocation}
                noLink
            />
        </Stack>
    );
};
