import { Location } from "../../../API";
import { Stack, Typography } from "@mui/material";

type TaskHistoryCardLocationDetailProps = {
    location?: Location | null;
};

const TaskHistoryCardLocationDetail: React.FC<TaskHistoryCardLocationDetailProps> =
    ({ location }) => {
        let addressString = "";
        if (location) {
            const items = [
                location.ward,
                location.line1,
                location.town,
                location.postcode,
            ];
            const filtered = items.filter((item) => item && item !== null);
            addressString = filtered.join(", ");
        }
        if (location) {
            return (
                <Stack>
                    <Typography sx={{ fontWeight: "bold" }}>
                        {location.name}
                    </Typography>
                    <Typography>{addressString}</Typography>
                </Stack>
            );
        } else {
            return (
                <Stack>
                    <div></div>
                    <div></div>
                </Stack>
            );
        }
    };

export default TaskHistoryCardLocationDetail;
