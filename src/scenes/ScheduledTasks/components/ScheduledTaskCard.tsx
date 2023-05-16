import React from "react";
import { Divider, Paper, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TaskCardLocationDetail from "../../../components/TaskCardLocationDetail";
import TaskCardChips from "../../../components/TaskCardChips";

import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../../../redux/Selectors";

type ScheduledTaskCardProps = {
    task: models.ScheduledTask;
};

const ScheduledTaskCard: React.FC<ScheduledTaskCardProps> = ({ task }) => {
    const [deliverables, setDeliverables] = React.useState<
        models.Deliverable[]
    >([]);
    const theme = useTheme();

    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const isLg = useMediaQuery(theme.breakpoints.up("lg"));
    const deliverableModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).deliverables;

    const getDeliverables = React.useCallback(async () => {
        try {
            const result = await DataStore.query(models.Deliverable);
            const filtered = result.filter(
                (d) => d.scheduledTask && d.scheduledTask.id === task.id
            );
            setDeliverables(filtered);
        } catch (error) {
            console.log(error);
        }
    }, [task.id]);

    React.useEffect(() => {
        getDeliverables();
    }, [getDeliverables, deliverableModelSynced]);

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
