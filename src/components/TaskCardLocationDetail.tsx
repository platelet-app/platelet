import { Location } from "../API";
import { Typography } from "@mui/material";
import * as models from "../models";

type TaskHistoryCardLocationDetailProps = {
    location?: Location | models.Location | null;
    nullLocationText?: string;
};

const TaskHistoryCardLocationDetail: React.FC<
    TaskHistoryCardLocationDetailProps
> = ({ location, nullLocationText = "No address" }) => {
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
            <Typography noWrap sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                {addressString}
            </Typography>
        );
    } else {
        return (
            <Typography noWrap sx={{ fontStyle: "italic", fontSize: "0.9rem" }}>
                {nullLocationText}
            </Typography>
        );
    }
};

export default TaskHistoryCardLocationDetail;
