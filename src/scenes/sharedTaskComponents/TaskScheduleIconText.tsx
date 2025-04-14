import React from "react";
import * as models from "../../models";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Box, Typography } from "@mui/material";
import taskScheduleDueStatus from "../../utilities/taskScheduleDueStatus";
import taskScheduleOverDueStatus from "../../utilities/taskScheduleOverDueStatus";
import humanReadableScheduleString from "../../utilities/humanReadableScheduleString";
import { useLocation } from "react-router";

type TaskScheduleIconTextProps = {
    schedule?: models.Schedule | null;
    showWarning?: boolean;
    dueTime?: number;
    appendText?: string;
    smallText?: boolean;
};

const TaskScheduleIconText: React.FC<TaskScheduleIconTextProps> = ({
    schedule,
    showWarning = true,
    dueTime = 1,
    appendText = "",
    smallText = false,
}) => {
    let location = useLocation();
    let shortened = false;
    // Shorter way to check if looking at a recurring scheduled task
    if (/scheduled/.test(location.pathname)) {
        shortened = true;
    }
    if (!schedule) return null;
    let iconColor = "";
    if (showWarning) {
        if (taskScheduleDueStatus(schedule, dueTime)) {
            iconColor = "orange";
        }
        if (taskScheduleOverDueStatus(schedule)) {
            iconColor = "red";
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
            }}
        >
            <ScheduleIcon
                sx={{ color: iconColor }}
                fontSize={smallText ? "small" : undefined}
            />
            <Typography
                sx={{
                    fontWeight: "bold",
                    fontSize: smallText ? "0.9rem" : undefined,
                }}
            >
                {humanReadableScheduleString(schedule, shortened)}{" "}
                <span
                    style={{
                        fontWeight: "normal",
                        color: "gray",
                        fontSize: "0.9rem",
                    }}
                >
                    {" "}
                    {appendText}
                </span>
            </Typography>
        </Box>
    );
};

export default TaskScheduleIconText;
