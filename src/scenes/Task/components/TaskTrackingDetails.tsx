import React, { ChangeEvent } from "react";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import { useModelQuery } from "@platelet-app/core";
import * as models from "@platelet-app/models";
import { mutations } from "@platelet-app/graphql";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Paper,
    Stack,
    Switch,
    TextField,
} from "@mui/material";
import { API, DataStore } from "aws-amplify";
import { useDispatch } from "react-redux";

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
    const dispatch = useDispatch();
    const { classes } = dialogCardStyles();
    const task = useModelQuery(models.Task, taskId);
    const firstLoad = React.useRef(false);

    React.useEffect(() => {
        if (!firstLoad.current && task?.state) {
            setToggleState(task?.state?.isBeingTracked ?? false);
            firstLoad.current = true;
        }
    }, [task]);

    const handleToggleTracking = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        try {
            const { checked } = event?.target;
            setToggleState(checked);
            const currentTask = await DataStore.query(models.Task, taskId);
            if (currentTask) {
                const newTask = models.Task.copyOf(currentTask, (t) => {
                    t.isBeingTracked = checked;
                });
                await DataStore.save(newTask);
            }
        } catch (e) {
            console.error(e);
            dispatch(displayErrorNotification("Sorry, something went wrong."));
        }
    };

    const handleSendTrackingLink = async () => {
        try {
            await API.graphql({
                query: mutations.sendTrackingLink,
                variables: { taskId, recipientEmail, recipientName },
            });
            setDialogOpen(false);
            dispatch(displayInfoNotification("Link sent!"));
        } catch (e) {
            console.error(e);
            dispatch(displayErrorNotification("Sorry, something went wrong."));
        }
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
            <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
            >
                <FormControlLabel
                    control={
                        <Switch
                            disabled={task?.isFetching}
                            checked={toggleState}
                            onChange={handleToggleTracking}
                        />
                    }
                    label="Tracked"
                />
                <Button
                    onClick={() => {
                        setDialogOpen(true);
                    }}
                    variant="outlined"
                    disabled={!toggleState}
                >
                    Send link
                </Button>
                <Dialog
                    PaperProps={{ sx: { borderRadius: "1em", padding: 1 } }}
                    open={dialogOpen}
                >
                    <DialogTitle>Send a tracking link</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} margin={1}>
                            <TextField
                                inputProps={{
                                    "aria-label": "recipient name",
                                }}
                                onChange={handleChangeRecipientName}
                                value={recipientName}
                                label="Recipient name"
                            />
                            <TextField
                                inputProps={{
                                    "aria-label": "recipient email",
                                }}
                                onChange={handleChangeRecipientEmail}
                                value={recipientEmail}
                                label="Recipient email"
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendTrackingLink}>Send</Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        </Paper>
    );
};
