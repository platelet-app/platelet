import React from "react";
import Typography from "@mui/material/Typography";
import { Divider, Stack } from "@mui/material";
import PopOutLocationSelector from "./PopOutLocationSelector";
import { useTheme } from "@mui/material/styles";
import PickUpAndDeliverSchedule from "../../../scenes/sharedTaskComponents/PickUpAndDeliverSchedule";

type PickUpAndDeliverDetailsProps = {
    onSetPickUpLocation: (location: any) => void;
    onSetDropOffLocation: (location: any) => void;
    onClearPickUpLocation: () => void;
    onClearDropOffLocation: () => void;
    overrides: {
        pickUpLocation: any;
        dropOffLocation: any;
    };
};

export const PickUpAndDeliverDetails: React.FC<
    PickUpAndDeliverDetailsProps
> = ({
    onSetPickUpLocation,
    onSetDropOffLocation,
    onClearPickUpLocation,
    onClearDropOffLocation,
    overrides,
}) => {
    const theme = useTheme();
    return (
        <Stack spacing={1}>
            {process.env.REACT_APP_DEMO_MODE !== "true" && (
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
                    Try searching for a house number and postcode
                </Typography>
            )}
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
            <Divider />
            <PickUpAndDeliverSchedule />
        </Stack>
    );
};
