import { Divider, IconButton, Paper, Stack } from "@mui/material";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import React from "react";
import TaskHandoverCard from "./TaskHandoverCard";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { AddIcCallRounded } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { tenantIdSelector } from "../../../redux/Selectors";

type TaskHandoversListProps = {
    taskId: string;
};

const TaskHandoversList: React.FC<TaskHandoversListProps> = ({ taskId }) => {
    const [handovers, setHandovers] = React.useState<models.Handover[]>([]);
    const cardClasses = dialogCardStyles();
    const tenantId = useSelector(tenantIdSelector);

    const getHandovers = React.useCallback(async () => {
        const result = (await DataStore.query(models.Handover)).filter(
            (h) => h.task?.id === taskId
        );
        setHandovers(result);
    }, [taskId]);

    React.useEffect(() => {
        getHandovers();
    }, [getHandovers]);

    const saveHandover = async () => {
        const currentTask = await DataStore.query(models.Task, taskId);
        if (currentTask && tenantId) {
            await DataStore.save(
                new models.Handover({
                    task: currentTask,
                    tenantId,
                })
            );
        }
    };

    return (
        <Paper className={cardClasses.root}>
            <Stack divider={<Divider />} direction="column">
                {handovers.map((h) => (
                    <TaskHandoverCard key={h.id} handover={h} />
                ))}
            </Stack>
            <IconButton aria-label="Add handover" onClick={saveHandover}>
                <AddIcCallRounded />
            </IconButton>
        </Paper>
    );
};

export default TaskHandoversList;
