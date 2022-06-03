import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Divider, Paper, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import {
    actions,
    dotActions,
} from "../components/MultipleSelectionActionsMenu";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import MultipleSelectionActionsInformation from "./MultipleSelectionActionsInformation";
import MultipleSelectionActionsAssignUser from "./MultipleSelectionActionsAssignUser";
import MultipleSelectionActionsSetTime from "./MultipleSelectionActionsSetTime";
import { useSelector } from "react-redux";
import { taskAssigneesSelector } from "../../../redux/Selectors";
import generateMultipleAssignmentModels from "../utilities/generateMultipleAssignmentModels";
import { userRoles } from "../../../apiConsts";
import generateMultipleTaskTimeModels from "../utilities/generateMultipleTaskTimeModels";

const getKey = (action) => {
    switch (action) {
        case actions.assignUser:
            return null;
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
    }
};

const MultipleSelectionActionsDialog = ({
    items,
    action,
    onCancel,
    open,
    onConfirmation,
}) => {
    const [isDisabled, setIsDisabled] = useState(true);
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

    const handleConfirmation = async () => {
        if (!saveData.current) return;
        setIsDisabled(true);
        if (action === actions.assignUser) {
            const generatedModels = await generateMultipleAssignmentModels(
                items,
                saveData.current[userRoles.coordinator] || [],
                saveData.current[userRoles.rider] || [],
                assignees
            );
            onConfirmation(generatedModels);
        } else if (timeAction) {
            const generatedModels = await generateMultipleTaskTimeModels(
                items,
                getKey(action),
                saveData.current,
                assignees.items
                    ? assignees.items.filter((a) => a.role === userRoles.rider)
                    : []
            );
            onConfirmation(generatedModels);
        }

        setIsDisabled(false);
    };

    const handleChange = React.useCallback((value) => {
        if (value) {
            saveData.current = value;
            setIsDisabled(false);
        } else {
            saveData.current = null;
            setIsDisabled(true);
        }
    }, []);

    if (action === actions.assignUser) {
        return (
            <ConfirmationDialog
                onCancel={onCancel}
                disabled={isDisabled}
                open={open}
                fullScreen={isSm}
                onConfirmation={handleConfirmation}
            >
                <Paper sx={sx}>
                    <Stack divider={<Divider />} direction="column" spacing={2}>
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
        );
    } else if (timeAction) {
        return (
            <ConfirmationDialog
                onCancel={onCancel}
                disabled={isDisabled}
                open={open}
                fullScreen={isSm}
                onConfirmation={handleConfirmation}
            >
                <Paper sx={sx}>
                    <Stack divider={<Divider />} direction="column" spacing={2}>
                        <MultipleSelectionActionsInformation
                            selectedItems={items}
                            action={action}
                        />
                        <MultipleSelectionActionsSetTime
                            selectedItems={items}
                            onChange={handleChange}
                        />
                    </Stack>
                </Paper>
            </ConfirmationDialog>
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
