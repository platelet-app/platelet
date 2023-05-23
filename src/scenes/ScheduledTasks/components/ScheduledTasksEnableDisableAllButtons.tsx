import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import useScheduledTasks from "../../../hooks/useScheduledTasks";

enum Action {
    EnableAll,
    DisableAll,
}

const ScheduledTasksEnableDisableAllButtons: React.FC = () => {
    const [action, setAction] = React.useState<Action | null>(null);
    const [isPosting, setIsPosting] = React.useState(false);
    const { state } = useScheduledTasks();
    const handleDisableAll = async () => {
        setIsPosting(true);
        const scheduledTasks = await DataStore.query(models.ScheduledTask);
        await Promise.all(
            scheduledTasks.map(async (scheduledTask) => {
                await DataStore.save(
                    models.ScheduledTask.copyOf(scheduledTask, (updated) => {
                        updated.disabled = 1;
                    })
                );
            })
        );
        setIsPosting(false);
    };
    const handleEnableAll = async () => {
        setIsPosting(true);
        const scheduledTasks = await DataStore.query(models.ScheduledTask);
        await Promise.all(
            scheduledTasks.map(async (scheduledTask) => {
                await DataStore.save(
                    models.ScheduledTask.copyOf(scheduledTask, (updated) => {
                        updated.disabled = 0;
                    })
                );
            })
        );
        setIsPosting(false);
    };

    const handleConfirmation = async () => {
        setAction(null);
        if (action === Action.EnableAll) {
            await handleEnableAll();
        } else if (action === Action.DisableAll) {
            await handleDisableAll();
        }
    };

    return (
        <>
            <Stack direction="row" spacing={2}>
                <Button
                    disabled={
                        !state.some((task) => task.disabled === 1) || isPosting
                    }
                    variant="contained"
                    onClick={() => setAction(Action.EnableAll)}
                >
                    Enable All
                </Button>
                <Button
                    disabled={
                        !state.some((task) => task.disabled === 0) || isPosting
                    }
                    variant="contained"
                    color="error"
                    onClick={() => setAction(Action.DisableAll)}
                >
                    Disable All
                </Button>
            </Stack>
            <ConfirmationDialog
                open={action !== null}
                onCancel={() => setAction(null)}
                onConfirmation={handleConfirmation}
            >
                {action === Action.EnableAll && (
                    <Typography>
                        Are you sure you want to enable all scheduled tasks?
                    </Typography>
                )}
                {action === Action.DisableAll && (
                    <Typography>
                        Are you sure you want to disable all scheduled tasks?
                    </Typography>
                )}
            </ConfirmationDialog>
        </>
    );
};

export default ScheduledTasksEnableDisableAllButtons;
