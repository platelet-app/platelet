import React, { useRef, useState } from "react";
import * as models from "../../../models";
import {
    Divider,
    Box,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
    actions,
    dotActions,
} from "../components/MultipleSelectionActionsMenu";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import MultipleSelectionActionsInformation from "./MultipleSelectionActionsInformation";
import MultipleSelectionActionsAssignUser from "./MultipleSelectionActionsAssignUser";
import MultipleSelectionActionsSetTime from "./MultipleSelectionActionsSetTime";
import MultipleSelectionActionsDuplicateTask from "./MultipleSelectionActionsDuplicateTask";
import { useDispatch, useSelector } from "react-redux";
import {
    getRoleView,
    getWhoami,
    taskAssigneesSelector,
    tenantIdSelector,
} from "../../../redux/Selectors";
import generateMultipleAssignmentModels from "../utilities/generateMultipleAssignmentModels";
import { TaskTimeKey } from "../../../apiConsts";
import generateMultipleTaskTimeModels from "../utilities/generateMultipleTaskTimeModels";
import generateMultipleTaskComments from "../utilities/generateMultipleTaskComments";
import { DataStore } from "aws-amplify";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import generateMultipleDuplicatedTaskModels from "../utilities/generateMultipleDuplicatedTaskModels";

const getKey = (action: actions | dotActions) => {
    switch (action) {
        case actions.markPickedUp:
            return "timePickedUp";
        case actions.markDelivered:
            return "timeDroppedOff";
        case actions.markRiderHome:
            return "timeRiderHome";
        case dotActions.markCancelled:
            return "timeCancelled";
        case dotActions.markRejected:
            return "timeRejected";
        default:
            return null;
    }
};

const duplicateInitialState = {
    copyAssignees: false,
    copyComments: false,
    assignMe: true,
};

export const duplicateFields = {
    copyAssignees: "Copy assignees",
    copyComments: "Copy my comments",
    assignMe: "Assign me",
};

export type DuplicateStateType = typeof duplicateInitialState;

type MultipleSelectionActionsDialogProps = {
    items: models.Task[];
    action: dotActions | actions | null;
    onCancel: (...args: any[]) => any;
    open: boolean;
    onConfirmation: (...args: any[]) => any;
};

const MultipleSelectionActionsDialog: React.FC<MultipleSelectionActionsDialogProps> =
    ({ items = [], action = null, onCancel, open = false, onConfirmation }) => {
        const [isDisabled, setIsDisabled] = useState(true);
        const [reasonBody, setReasonBody] = useState("");
        const [nameInput, setNameInput] = React.useState("");
        const [duplicateState, setDuplicateState] =
            useState<DuplicateStateType>(duplicateInitialState);
        const [largeCountConfirm, setLargeCountConfirm] = useState(false);
        const roleView = useSelector(getRoleView);
        const dispatch = useDispatch();
        const tenantId = useSelector(tenantIdSelector);
        const whoami = useSelector(getWhoami);
        const saveData = useRef(null);
        const assignees = useSelector(taskAssigneesSelector);
        const isSm = useMediaQuery(useTheme().breakpoints.down("sm"));

        const sx = {
            padding: 1,
            minWidth: { xs: 0, sm: 500 },
            minHeight: 300,
        };

        const timeAction = [
            actions.markPickedUp,
            actions.markDelivered,
            actions.markRiderHome,
            dotActions.markCancelled,
            dotActions.markRejected,
        ].some((a) => action === a);

        const handleDuplicateConfirmation = async () => {
            try {
                setIsDisabled(true);
                const assigneeId = duplicateState.assignMe ? whoami.id : null;
                const commentsId = duplicateState.copyComments
                    ? whoami.id
                    : null;
                const assigneeRole = [models.Role.COORDINATOR, "ALL"].includes(
                    roleView
                )
                    ? models.Role.COORDINATOR
                    : models.Role.RIDER;
                const newModels = await generateMultipleDuplicatedTaskModels(
                    items,
                    tenantId,
                    whoami.id,
                    duplicateState.copyAssignees,
                    assigneeId,
                    assigneeRole,
                    commentsId
                );
                onConfirmation(newModels);
                setIsDisabled(false);
            } catch (error) {
                console.log(error);
                setIsDisabled(false);
                dispatch(
                    displayErrorNotification("Sorry, something went wrong")
                );
            }
        };

        const handleConfirmation = () => {
            if (Object.values(items).length > 5) {
                setLargeCountConfirm(true);
            } else {
                finalConfirmation();
            }
        };

        const finalConfirmation = async () => {
            if (action === dotActions.duplicate) {
                handleDuplicateConfirmation();
            } else {
                if (!saveData.current) return;
                try {
                    setIsDisabled(true);
                    if (action === actions.assignUser) {
                        const generatedModels =
                            await generateMultipleAssignmentModels(
                                items,
                                saveData.current[models.Role.COORDINATOR] || [],
                                saveData.current[models.Role.RIDER] || [],
                                assignees.items,
                                tenantId
                            );
                        onConfirmation(generatedModels);
                    } else if (timeAction) {
                        let nameKey: TaskTimeKey = null;
                        if (action === actions.markPickedUp) {
                            nameKey = "timePickedUpSenderName";
                        } else if (action === actions.markDelivered) {
                            nameKey = "timeDroppedOffRecipientName";
                        }
                        const finalName = nameInput || null;
                        const assigneesForFunction = assignees.items
                            ? assignees.items.filter(
                                  (a: models.TaskAssignee) =>
                                      a.role === models.Role.RIDER
                              )
                            : [];

                        if (!action) return;
                        const generatedModels =
                            await generateMultipleTaskTimeModels(
                                items,
                                getKey(action),
                                saveData.current,
                                assigneesForFunction,
                                nameKey,
                                finalName
                            );

                        let generatedComments: models.Comment[] = [];
                        if (reasonBody) {
                            const whoamiResult = await DataStore.query(
                                models.User,
                                whoami.id
                            );
                            if (whoamiResult) {
                                generatedComments =
                                    await generateMultipleTaskComments(
                                        items,
                                        reasonBody,
                                        whoamiResult,
                                        tenantId
                                    );
                            }
                        }
                        onConfirmation([
                            ...generatedModels,
                            ...generatedComments,
                        ]);
                    }
                    setReasonBody("");
                    setIsDisabled(false);
                } catch (error) {
                    console.log(error);
                    setIsDisabled(false);
                    dispatch(
                        displayErrorNotification("Sorry, something went wrong")
                    );
                }
            }
        };

        const onChangeDuplicateState = (key: keyof DuplicateStateType) => {
            setDuplicateState((prevState) => ({
                ...prevState,
                [key]: !prevState[key],
            }));
        };

        React.useEffect(() => {
            if (action === dotActions.duplicate) {
                setIsDisabled(false);
            }
        }, [action]);

        const handleChange = React.useCallback((value) => {
            if (value) {
                saveData.current = value;
                setIsDisabled(false);
            } else {
                saveData.current = null;
                setIsDisabled(true);
            }
        }, []);

        const largeItemDialog = (
            <ConfirmationDialog
                open={largeCountConfirm}
                onConfirmation={finalConfirmation}
                onCancel={() => setLargeCountConfirm(false)}
            >
                <Typography>
                    {`You have ${Object.values(items).length} items selected.`}
                </Typography>
                <Typography>Are you sure?</Typography>
            </ConfirmationDialog>
        );

        if (action === actions.assignUser) {
            return (
                <>
                    <ConfirmationDialog
                        onCancel={onCancel}
                        disabled={isDisabled}
                        open={open}
                        fullScreen={isSm}
                        onConfirmation={handleConfirmation}
                    >
                        <Box sx={sx}>
                            <Stack
                                divider={<Divider />}
                                direction="column"
                                spacing={2}
                            >
                                <MultipleSelectionActionsInformation
                                    selectedItems={items}
                                    action={action}
                                />
                                <MultipleSelectionActionsAssignUser
                                    onChange={handleChange}
                                />
                            </Stack>
                        </Box>
                    </ConfirmationDialog>
                    {largeItemDialog}
                </>
            );
        } else if (action === dotActions.duplicate) {
            const showHint = Object.values(items).some((t) =>
                [
                    models.TaskStatus.PICKED_UP,
                    models.TaskStatus.DROPPED_OFF,
                ].some((ts) => t.status === ts)
            );
            return (
                <>
                    <ConfirmationDialog
                        onCancel={onCancel}
                        disabled={isDisabled}
                        open={open}
                        fullScreen={isSm}
                        onConfirmation={handleConfirmation}
                    >
                        <Box sx={sx}>
                            <Stack
                                divider={<Divider />}
                                direction="column"
                                spacing={2}
                            >
                                <MultipleSelectionActionsInformation
                                    selectedItems={items}
                                    action={action}
                                />
                                <MultipleSelectionActionsDuplicateTask
                                    options={duplicateState}
                                    onChange={onChangeDuplicateState}
                                    showHint={showHint}
                                />
                            </Stack>
                        </Box>
                    </ConfirmationDialog>
                    {largeItemDialog}
                </>
            );
        } else if (timeAction) {
            const nameLabel =
                action === actions.markPickedUp
                    ? "Sender name"
                    : "Recipient name";
            return (
                <>
                    <ConfirmationDialog
                        onCancel={onCancel}
                        disabled={isDisabled}
                        open={open}
                        fullScreen={isSm}
                        onConfirmation={handleConfirmation}
                    >
                        <Box sx={sx}>
                            <Stack
                                divider={<Divider />}
                                direction="column"
                                spacing={2}
                            >
                                <MultipleSelectionActionsInformation
                                    selectedItems={items}
                                    action={action}
                                />
                                <MultipleSelectionActionsSetTime
                                    onChange={handleChange}
                                />
                                {[
                                    dotActions.markRejected,
                                    dotActions.markCancelled,
                                ].some((a) => action === a) && (
                                    <TextField
                                        inputProps={{
                                            "aria-label": "Enter a reason",
                                        }}
                                        multiline
                                        placeholder="Enter a reason"
                                        value={reasonBody}
                                        onChange={(e) =>
                                            setReasonBody(e.target.value)
                                        }
                                    />
                                )}
                                {[
                                    actions.markPickedUp,
                                    actions.markDelivered,
                                ].some((a) => action === a) && (
                                    <TextField
                                        label={nameLabel}
                                        inputProps={{
                                            "aria-label": nameLabel,
                                        }}
                                        fullWidth
                                        value={nameInput}
                                        onChange={(e) =>
                                            setNameInput(e.target.value)
                                        }
                                    />
                                )}
                            </Stack>
                        </Box>
                    </ConfirmationDialog>
                    {largeItemDialog}
                </>
            );
        }
        return null;
    };

export default MultipleSelectionActionsDialog;
