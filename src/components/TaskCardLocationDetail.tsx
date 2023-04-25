import { Location } from "../API";
import { Stack, Typography } from "@mui/material";
import * as models from "../models";

type TaskHistoryCardLocationDetailProps = {
    location?: Location | models.Location | null;
};

const TaskHistoryCardLocationDetail: React.FC<
    TaskHistoryCardLocationDetailProps
> = ({ location }) => {
    let addressString = "";
    if (location) {
        const items = [
            location.ward,
            location.line1,
            location.line2,
            location.line3,
            location.town,
            location.postcode,
        ];
        const filtered = items.filter((item) => item && item !== null);
        addressString = filtered.join(", ");
    }
    if (location) {
        return (
            <Stack>
                <Typography noWrap sx={{ fontSize: "0.9rem" }}>
                    {addressString}
                </Typography>
            </Stack>
        );
    } else {
        return null;
    }
};

export default TaskHistoryCardLocationDetail;
