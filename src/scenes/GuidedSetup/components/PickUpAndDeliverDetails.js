import React from "react";
import Typography from "@mui/material/Typography";
import { Divider, Stack } from "@mui/material";
import PopOutLocationSelector from "./PopOutLocationSelector";
import { useTheme } from "@mui/styles";

export const PickUpAndDeliverDetails = ({
    onSetPickUpLocation,
    onSetDropOffLocation,
    onClearPickUpLocation,
    onClearDropOffLocation,
    overrides,
}) => {
    const theme = useTheme();
    return (
        <Stack spacing={1}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography variant="h6">Where from?</Typography>
                {overrides.pickUpLocation && (
                    <Typography
                        sx={{
                            fontStyle: "italic",
                            color: "gray",
                            "&:hover": {
                                color:
                                    theme.palette.mode === "dark"
                                        ? "white"
                                        : "black",
                            },
                        }}
                    >
                        Same as establishment
                    </Typography>
                )}
            </Stack>
            <PopOutLocationSelector
                label="pick-up"
                onChange={onSetPickUpLocation}
                onClear={onClearPickUpLocation}
                override={overrides.pickUpLocation}
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
