import * as models from "../../../models";
import { Typography, Divider, Stack } from "@mui/material";

type TaskHandoverHeaderFooterProps = {
    location?: models.Location | null;
    header?: boolean;
    footer?: boolean;
};

const TaskHandoverHeaderFooter: React.FC<TaskHandoverHeaderFooterProps> = ({
    location = null,
    header = false,
    footer = false,
}) => {
    if (!location) {
        return null;
    } else {
        let locationString = location.name;
        if (!locationString) {
            locationString = location.line1;
            if (location.line2) {
                locationString += ", " + location.line2;
            }
        }
        return (
            <Stack spacing={1} sx={{ padding: 1 }}>
                {footer && <Divider />}
                <Typography variant="h5">{locationString}</Typography>
                {header && <Divider />}
            </Stack>
        );
    }
};

export default TaskHandoverHeaderFooter;
