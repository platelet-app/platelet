import React from "react";
import Typography from "@mui/material/Typography";
import { Divider, Stack } from "@mui/material";
import PopOutLocationSelector from "./PopOutLocationSelector";
import { useTheme } from "@mui/material/styles";
import PickUpAndDeliverSchedule, {
    Schedule,
} from "../../../scenes/sharedTaskComponents/PickUpAndDeliverSchedule";

type PickUpAndDeliverDetailsProps = {
    onSetPickUpLocation: (location: any) => void;
    onSetDropOffLocation: (location: any) => void;
    onClearPickUpLocation: () => void;
    onClearDropOffLocation: () => void;
    overrides: {
        pickUpLocation?: any;
        dropOffLocation?: any;
    };
    onSetSchedule: (schedule: {
        pickUp: Schedule | null;
        dropOff: Schedule | null;
    }) => void;
    schedule: { pickUp: Schedule | null; dropOff: Schedule | null };
};

export const PickUpAndDeliverDetails: React.FC<
    PickUpAndDeliverDetailsProps
> = ({
    onSetPickUpLocation,
    onSetDropOffLocation,
    onClearPickUpLocation,
    onClearDropOffLocation,
    onSetSchedule,
    schedule,
    overrides,
}) => {
    const theme = useTheme();
    const [pickUpOpen, setPickUpOpen] = React.useState(false);
    const [dropOffOpen, setDropOffOpen] = React.useState(false);
    const handlePickUpScheduleConfirm = (newValue: Schedule | null) => {
        onSetSchedule({ ...schedule, pickUp: newValue });
    };

    const handleDropOffScheduleConfirm = (newValue: Schedule | null) => {
        onSetSchedule({ ...schedule, dropOff: newValue });
    };

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
            <PickUpAndDeliverSchedule
                title="Pick-up schedule"
                initialSchedule={schedule.pickUp}
                onConfirm={handlePickUpScheduleConfirm}
                handleClose={() => setPickUpOpen(false)}
                key={pickUpOpen ? "pick-up" : "pick-up-2"}
                open={pickUpOpen}
                handleOpen={() => setPickUpOpen(true)}
            />
            <Divider />
            <Typography variant="h6">Where to?</Typography>
            <PopOutLocationSelector
                label="delivery"
                onChange={onSetDropOffLocation}
                onClear={onClearDropOffLocation}
            />
            <Divider />
            <PickUpAndDeliverSchedule
                title="Delivery schedule"
                onConfirm={handleDropOffScheduleConfirm}
                handleClose={() => setDropOffOpen(false)}
                initialSchedule={schedule.dropOff}
                key={dropOffOpen ? "drop-off" : "drop-off-2"}
                open={dropOffOpen}
                handleOpen={() => setDropOffOpen(true)}
            />
        </Stack>
    );
};
