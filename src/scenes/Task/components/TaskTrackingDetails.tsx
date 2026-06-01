import React, {
    ChangeEvent,
    ChangeEventHandler,
    FormEvent,
    ReactText,
} from "react";
import { useModelSubscription } from "@platelet-app/core";
import * as models from "@platelet-app/models";
import { mutations } from "@platelet-app/graphql";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Paper,
    Stack,
    Switch,
    TextField,
    ToggleButton,
    Typography,
} from "@mui/material";
import { API, DataStore } from "aws-amplify";

type TaskTrackingDetailsProps = {
    taskId: string;
};

export const TaskTrackingDetails: React.FC<TaskTrackingDetailsProps> = ({
    taskId,
}) => {
    const [toggleState, setToggleState] = React.useState(false);
    const [recipientEmail, setRecipientEmail] = React.useState("");
    const [recipientName, setRecipientName] = React.useState("");
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const { classes } = dialogCardStyles();
    const task = useModelSubscription(models.Task, taskId);
    const firstLoad = React.useRef(false);
    console.log(task);

    React.useEffect(() => {
        if (!firstLoad.current && task?.state) {
            setToggleState(task?.state?.isBeingTracked ?? false);
            firstLoad.current = true;
        }
    }, [task]);

    const handleToggleTracking = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const { checked } = event?.target;
        console.log("asdf", checked);
        setToggleState(checked);
        const currentTask = await DataStore.query(models.Task, taskId);
        if (currentTask) {
            const newTask = models.Task.copyOf(currentTask, (t) => {
                t.isBeingTracked = checked;
            });
            await DataStore.save(newTask);
        }
    };

    const handleSendTrackingLink = async () => {
        await API.graphql({
            query: mutations.sendTrackingLink,
            variables: { taskId, recipientEmail, recipientName },
        });
        setDialogOpen(false);
    };

    const handleChangeRecipientName = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = event.target;
        setRecipientName(value);
    };

    const handleChangeRecipientEmail = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = event.target;
        setRecipientEmail(value);
    };

    return (
        <Paper className={classes?.root}>
            <Stack>
                <Typography>
                    {task?.state?.isBeingTracked && "Task is being tracked."}
                    {!task?.state?.isBeingTracked &&
                        "Task is not being tracked."}
                </Typography>
                <Switch
                    disabled={task?.isFetching}
                    checked={toggleState}
                    onChange={handleToggleTracking}
                />
                <Button
                    onClick={() => {
                        setDialogOpen(true);
                    }}
                    disabled={!toggleState}
                >
                    Send link
                </Button>
                <Dialog open={dialogOpen}>
                    <DialogContent>
                        <TextField
                            onChange={handleChangeRecipientName}
                            value={recipientName}
                            label="Recipient name"
                        />
                        <TextField
                            onChange={handleChangeRecipientEmail}
                            value={recipientEmail}
                            label="Recipient email"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSendTrackingLink}>Send</Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        </Paper>
    );
};
