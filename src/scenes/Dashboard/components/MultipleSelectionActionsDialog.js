import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import * as models from "../../../models";
import {
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/styles";
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
import { tasksStatus, userRoles } from "../../../apiConsts";
import generateMultipleTaskTimeModels from "../utilities/generateMultipleTaskTimeModels";
import generateMultipleTaskComments from "../utilities/generateMultipleTaskComments";
import { DataStore } from "aws-amplify";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import generateMultipleDuplicatedTaskModels from "../utilities/generateMultipleDuplicatedTaskModels";

const getKey = (action) => {
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

const MultipleSelectionActionsDialog = ({
    items,
    action,
    onCancel,
    open,
    onConfirmation,
}) => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [reasonBody, setReasonBody] = useState("");
    const [nameInput, setNameInput] = React.useState("");
    const [duplicateState, setDuplicateState] = useState(duplicateInitialState);
    const [largeCountConfirm, setLargeCountConfirm] = useState(false);
    const roleView = useSelector(getRoleView);
    const dispatch = useDispatch();
    const tenantId = useSelector(tenantIdSelector);
    const whoami = useSelector(getWhoami);
    const saveData = useRef(null);
    const assignees = useSelector(taskAssigneesSelector);
    const isSm = useMediaQuery(useTheme().breakpoints.down("sm"));
    const sx = {
        padding: 2,
        minWidth: { xs: 0, sm: 500 },
        minHeight: 300,
    };
    const timeAction = [
        actions.markPickedUp,
        actions.markDelivered,
        actions.markRiderHome,
        dotActions.markCancelled,
        dotActions.markRejected,
    ].includes(action);

    const handleDuplicateConfirmation = async () => {
        try {
            setIsDisabled(true);
            const assigneeId = duplicateState.assignMe ? whoami.id : null;
            const commentsId = duplicateState.copyComments ? whoami.id : null;
            const assigneeRole = [userRoles.coordinator, "ALL"].includes(
                roleView
            )
                ? userRoles.coordinator
                : userRoles.rider;
            const models = await generateMultipleDuplicatedTaskModels(
                items,
                duplicateState.copyAssignees,
                assigneeId,
                assigneeRole,
                commentsId
            );
            onConfirmation(models);
            setIsDisabled(false);
        } catch (error) {
            throw error;
            console.log(error);
            setIsDisabled(false);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
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
                            saveData.current[userRoles.coordinator] || [],
                            saveData.current[userRoles.rider] || [],
                            assignees,
                            tenantId
                        );
                    onConfirmation(generatedModels);
                } else if (timeAction) {
                    let nameKey;
                    if (action === actions.markPickedUp) {
                        nameKey = "timePickedUpSenderName";
                    } else if (action === actions.markDelivered) {
                        nameKey = "timeDroppedOffRecipientName";
                    }
                    const finalName = nameInput || null;
                    const assigneesForFunction = assignees.items
                        ? assignees.items.filter(
                              (a) => a.role === userRoles.rider
                          )
                        : [];
                    const generatedModels =
                        await generateMultipleTaskTimeModels(
                            items,
                            getKey(action),
                            saveData.current,
                            assigneesForFunction,
                            nameKey,
                            finalName
                        );
                    let generatedComments = [];
                    if (reasonBody) {
                        const whoamiResult = await DataStore.query(
                            models.User,
                            whoami.id
                        );
                        generatedComments = await generateMultipleTaskComments(
                            items,
                            reasonBody,
                            whoamiResult,
                            tenantId
                        );
                    }
                    onConfirmation([...generatedModels, ...generatedComments]);
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

    const onChangeDuplicateState = (key) => {
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
                    <Paper sx={sx}>
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
                                selectedItems={items}
                            />
                        </Stack>
                    </Paper>
                </ConfirmationDialog>
                {largeItemDialog}
            </>
        );
    } else if (action === dotActions.duplicate) {
        const showHint = Object.values(items).some((t) =>
            [tasksStatus.pickedUp, tasksStatus.droppedOff].includes(t.status)
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
                    <Paper sx={sx}>
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
                    </Paper>
                </ConfirmationDialog>
                {largeItemDialog}
            </>
        );
    } else if (timeAction) {
        const nameLabel =
            action === actions.markPickedUp ? "Sender name" : "Recipient name";
        return (
            <>
                <ConfirmationDialog
                    onCancel={onCancel}
                    disabled={isDisabled}
                    open={open}
                    fullScreen={isSm}
                    onConfirmation={handleConfirmation}
                >
                    <Paper sx={sx}>
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
                                selectedItems={items}
                                onChange={handleChange}
                            />
                            {[
                                dotActions.markRejected,
                                dotActions.markCancelled,
                            ].includes(action) && (
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
                            ].includes(action) && (
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
                    </Paper>
                </ConfirmationDialog>
                {largeItemDialog}
            </>
        );
    }
    return null;
};

MultipleSelectionActionsDialog.propTypes = {
    onChange: PropTypes.func,
    items: PropTypes.object,
    action: PropTypes.string,
};

MultipleSelectionActionsDialog.defaultProps = {
    onChange: () => {},
    items: [],
    action: "",
};

export default MultipleSelectionActionsDialog;
