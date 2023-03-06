import { Location } from "../../../API";
import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";

type TaskHistoryCardLocationDetailProps = {
    location?: Location | null;
};

const TaskHistoryCardLocationDetail: React.FC<TaskHistoryCardLocationDetailProps> =
    ({ location }) => {
        const addressString = location
            ? `${location.ward}, ${location.line1}`
            : "";
        return (
            <Stack>
                {location ? (
                    <Typography variant="h6">{location.name}</Typography>
                ) : (
                    <Typography sx={{ fontStyle: "italic" }} variant="h6">
                        No location
                    </Typography>
                )}
                <Typography>{addressString}</Typography>
            </Stack>
        );
    };

export default TaskHistoryCardLocationDetail;
