import React from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";

type TaskHistoryTimestampProps = {
    timestamp: string;
};

const TaskHistoryTimestamp: React.FC<TaskHistoryTimestampProps> = ({
    timestamp,
}) => {
    const theme = useTheme();
    return (
        <Typography
            sx={{
                fontStyle: "italic",
                fontSize: "0.9rem",
                maxWidth: "100%",
                color: "gray",
                "&:hover": {
                    color: theme.palette.mode === "dark" ? "white" : "black",
                },
            }}
        >
            {moment(timestamp).calendar()}
        </Typography>
    );
};

export default TaskHistoryTimestamp;
