import PopOutLocationSelector from "../../GuidedSetup/components/PopOutLocationSelector";
import * as models from "../../../models";
import { Divider, Stack, Typography } from "@mui/material";

type PickUpAndDeliverLocationProps = {
    onChange: (
        key: "pickUpLocation" | "dropOffLocation",
        value: models.Location | null
    ) => void;
};

const ScheduledTaskPickUpAndDropOffDetails: React.FC<
    PickUpAndDeliverLocationProps
> = ({ onChange }) => {
    const onSetPickUpLocation = (location: models.Location) => {
        onChange("pickUpLocation", location);
    };
    const onClearPickUpLocation = () => {
        console.log("asdffads");
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
                label="pick-up"
                onChange={onSetPickUpLocation}
                onClear={onClearPickUpLocation}
            />
            <Typography variant="h6">Where to?</Typography>
            <PopOutLocationSelector
                label="deliver"
                onChange={onSetDropOffLocation}
                onClear={onClearDropOffLocation}
            />
        </Stack>
    );
};

export default ScheduledTaskPickUpAndDropOffDetails;
