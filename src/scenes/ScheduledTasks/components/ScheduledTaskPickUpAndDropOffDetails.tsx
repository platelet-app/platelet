import PopOutLocationSelector from "../../GuidedSetup/components/PopOutLocationSelector";
import * as models from "../../../models";
import { Divider, Stack, Typography } from "@mui/material";
import React from "react";
import PickUpAndDeliverSchedule, {
    Schedule,
} from "../../sharedTaskComponents/PickUpAndDeliverSchedule";

type PickUpAndDeliverLocationProps = {
    onChange: (
        key: "pickUpLocation" | "dropOffLocation",
        value: models.Location | null
    ) => void;
    onChangeSchedule: (
        key: "pickUp" | "dropOff",
        value: Schedule | null
    ) => void;
    initialSchedule: {
        pickUp: Schedule | null;
        dropOff: Schedule | null;
    };
    reset: boolean;
};

const ScheduledTaskPickUpAndDropOffDetails: React.FC<
    PickUpAndDeliverLocationProps
> = ({ onChange, onChangeSchedule, initialSchedule, reset }) => {
    const [pickUpOpen, setPickUpOpen] = React.useState(false);
    const [dropOffOpen, setDropOffOpen] = React.useState(false);

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
    const onSetPickUpSchedule = (schedule: Schedule | null) => {
        onChangeSchedule("pickUp", schedule);
    };
    const onSetDropOffSchedule = (schedule: Schedule | null) => {
        onChangeSchedule("dropOff", schedule);
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

            <PickUpAndDeliverSchedule
                title="Pick-up schedule"
                key={`${reset}ps`}
                onConfirm={onSetPickUpSchedule}
                initialSchedule={initialSchedule.pickUp}
                open={pickUpOpen}
                handleOpen={() => setPickUpOpen(true)}
                handleClose={() => setPickUpOpen(false)}
                hideDate
            />
            <Typography variant="h6">Where to?</Typography>
            <PopOutLocationSelector
                key={`${reset}d`}
                label="deliver"
                onChange={onSetDropOffLocation}
                onClear={onClearDropOffLocation}
            />
            <PickUpAndDeliverSchedule
                title="Drop-off schedule"
                key={`${reset}pd`}
                onConfirm={onSetDropOffSchedule}
                initialSchedule={initialSchedule.dropOff}
                open={dropOffOpen}
                handleOpen={() => setDropOffOpen(true)}
                handleClose={() => setDropOffOpen(false)}
                hideDate
            />
        </Stack>
    );
};

export default ScheduledTaskPickUpAndDropOffDetails;
