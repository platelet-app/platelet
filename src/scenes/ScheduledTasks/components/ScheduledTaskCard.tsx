import React from "react";
import { Divider, Paper, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TaskCardLocationDetail from "../../../components/TaskCardLocationDetail";
import TaskCardChips from "../../../components/TaskCardChips";

import * as models from "../../../models";
import useTaskDeliverablesRedux from "../../../hooks/useTaskDeliverablesRedux";

type ScheduledTaskCardProps = {
    task: models.ScheduledTask;
};

const ScheduledTaskCard: React.FC<ScheduledTaskCardProps> = ({ task }) => {
    const theme = useTheme();

    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const isLg = useMediaQuery(theme.breakpoints.up("lg"));

    const deliverables = useTaskDeliverablesRedux(task.id, "ScheduledTask");

    let cutOff = 6;
    if (isSm) {
        cutOff = 4;
    } else if (isLg) {
        cutOff = 8;
    }

    const sxDisabled = {
        position: "relative",
        "&::before": {
            content: "''",
            borderRadius: "1em",
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 1,
        },
        "&::after": {
            content: "'disabled'",
            color: "red",
            fontStyle: "italic",
            position: "absolute",
            top: 10,
            right: 20,
        },
    };

    return (
        <Paper
            sx={{
                ...(task.disabled === 1 ? sxDisabled : {}),
                borderRadius: "1em",
            }}
        >
            <Stack
                sx={{
                    padding: 1,
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                }}
                spacing={0.5}
                justifyContent="space-between"
                direction="column"
            >
                <TaskCardChips
                    showDeliverableIcons
                    deliverables={deliverables}
                    limit={cutOff}
                    priority={task.priority}
                />
                <TaskCardLocationDetail
                    nullLocationText="No pick up address"
                    location={task.pickUpLocation}
                />
                <Divider sx={{ width: "70%" }} />
                <TaskCardLocationDetail
                    nullLocationText="No delivery address"
                    location={task.dropOffLocation}
                />
            </Stack>
        </Paper>
    );
};

export default ScheduledTaskCard;
