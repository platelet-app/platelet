import React, { useEffect, useRef, useState } from "react";
import * as selectionModeActions from "../../../redux/selectionMode/selectionModeActions";
import { useTheme } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    Box,
    Button,
    Divider,
    IconButton,
    Stack,
    useMediaQuery,
    Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as selectionActions from "../../../redux/selectionMode/selectionModeActions";
import {
    availableSelectionItemsSelector,
    dashboardFilteredUserSelector,
    dashboardTabIndexSelector,
    getRoleView,
    selectedItemsSelector,
} from "../../../redux/Selectors";
import { userRoles } from "../../../apiConsts";
import { DataStore } from "aws-amplify";
import { PersistentModel } from "@aws-amplify/datastore";
import MultipleSelectionActionsDialog from "./MultipleSelectionActionsDialog";
import LoadingSpinner from "../../../components/LoadingSpinner";
import _ from "lodash";
import MultipleSelectionCheckbox from "./MultipleSelectionCheckbox";
import * as models from "../../../models";

export enum actions {
    assignUser = "Assign User",
    markPickedUp = "Picked Up",
    markDelivered = "Delivered",
    markRiderHome = "Rider Home",
}

export enum dotActions {
    markCancelled = "Cancelled",
    markRejected = "Rejected",
    duplicate = "Duplicate",
}

type mouseStateType = {
    mouseX: null | number;
    mouseY: null | number;
};

const mouseState = {
    mouseX: null,
    mouseY: null,
};

function MultipleSelectionActionsMenu() {
    const selectedItemsAll = useSelector(selectedItemsSelector);
    const availableSelection = useSelector(availableSelectionItemsSelector);
    const availableSelectionItems = Object.values(availableSelection);
    const tabIndex = useSelector(dashboardTabIndexSelector);
    const [state, setState] = useState<mouseStateType>(mouseState);
    const selectedItems = selectedItemsAll[tabIndex] || {};
    const [currentAction, setCurrentAction] = useState<
        actions | dotActions | null
    >(null);
    const [saveProgress, setSaveProgress] = useState<null | number>(null);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const isMd = useMediaQuery(theme.breakpoints.down("md"));
    const [errorState, setErrorState] = useState(null);
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const availableItemsWithoutFilterRef = useRef(availableSelectionItems);
    const roleView = useSelector(getRoleView);

    const actualRole = ["ALL", userRoles.coordinator].includes(roleView)
        ? userRoles.coordinator
        : userRoles.rider;
    const actualDotActions =
        actualRole === userRoles.rider
            ? _.omit(dotActions, "duplicate")
            : dotActions;
    let buttonActions = isMd ? actions : { ...actions, ...actualDotActions };

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        setState(mouseState);
    };

    useEffect(() => {
        if (!dashboardFilteredUser) {
            // keeps the icon checked if all items were selected
            availableItemsWithoutFilterRef.current = availableSelectionItems;
        }
    }, [dashboardFilteredUser, availableSelectionItems]);

    function checkButtonDisabled(action: actions | dotActions) {
        if (!selectedItems) return true;
        const values: models.Task[] = Object.values(selectedItems);
        if (action === actions.assignUser) {
            return values.length === 0;
        }
        if (
            values.some((item) => {
                return [
                    models.TaskStatus.COMPLETED,
                    models.TaskStatus.CANCELLED,
                    models.TaskStatus.ABANDONED,
                    models.TaskStatus.REJECTED,
                ].some((ts) => item.status === ts);
            })
        ) {
            return true;
        }
        if (action === actions.markPickedUp) {
            return (
                values.length === 0 ||
                values.some((item) => {
                    return item.status !== models.TaskStatus.ACTIVE;
                })
            );
        }
        if (action === actions.markDelivered) {
            return (
                values.length === 0 ||
                values.some((item) => {
                    return item.status !== models.TaskStatus.PICKED_UP;
                })
            );
        }
        if (action === actions.markRiderHome) {
            return (
                values.length === 0 ||
                values.some((item) => {
                    return item.status !== models.TaskStatus.DROPPED_OFF;
                })
            );
        }
        if (
            [dotActions.markCancelled, dotActions.markRejected].includes(action)
        ) {
            return (
                values.length === 0 ||
                values.some((item) => {
                    return item.status === models.TaskStatus.DROPPED_OFF;
                })
            );
        }
    }

    const dotsMenu = (
        <>
            <IconButton
                aria-label="More Selection Actions"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                keepMounted
                open={state.mouseY !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    state.mouseY !== null && state.mouseX !== null
                        ? { top: state.mouseY, left: state.mouseX }
                        : undefined
                }
            >
                {Object.values(actualDotActions).map((action) => {
                    return (
                        <MenuItem
                            aria-label={`Selection ${action}`}
                            disabled={checkButtonDisabled(action)}
                            key={action}
                            onClick={(e) => {
                                handleClose(e);
                                handleActionClick(action);
                            }}
                        >
                            {action}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );

    function handleActionClick(action: actions | dotActions) {
        setCurrentAction(action);
    }

    function saveModels(models: PersistentModel[]) {
        setErrorState(null);
        let count = 0;
        const promises = models.map((model) =>
            DataStore.save(model)
                .then(() => {
                    count++;
                    setSaveProgress((count * 100) / models.length);
                })
                .catch((error) => {
                    setErrorState(error);
                    console.log(error);
                })
        );
        return Promise.all(promises);
    }

    async function handleConfirmation(models: PersistentModel[]) {
        setCurrentAction(null);
        dispatch(selectionActions.setSelectionActionsPending(true));
        await saveModels(models);
        dispatch(selectionModeActions.clearItems(tabIndex));
        dispatch(selectionActions.setSelectionActionsPending(false));
    }

    const dispatch = useDispatch();

    return (
        <>
            <Box
                sx={{
                    position: {
                        xs: "fixed",
                        sm: "relative",
                    },
                    display: {
                        xs: _.isEmpty(selectedItems) ? "none" : "block",
                        sm: "block",
                    },
                    zIndex: 1000,
                    bottom: { xs: 0, sm: "auto" },
                    width: { xs: "100%", sm: "auto" },
                    background: theme.palette.background.paper,
                }}
            >
                {isSm && Object.keys(selectedItems).length > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ margin: 0.5 }} fontWeight="bold">
                            You have {Object.keys(selectedItems).length}{" "}
                            selected{" "}
                            {Object.keys(selectedItems).length > 1
                                ? "items"
                                : "item"}
                        </Typography>
                        <Button
                            size="small"
                            onClick={() =>
                                dispatch(selectionActions.clearItems(tabIndex))
                            }
                        >
                            Deselect All
                        </Button>
                    </Stack>
                )}
                <Stack
                    sx={{ minHeight: 50 }}
                    alignItems="center"
                    spacing={2}
                    direction="row"
                >
                    {!isSm && <MultipleSelectionCheckbox />}
                    {selectedItems && Object.values(selectedItems).length > 0 && (
                        <Stack
                            sx={{ width: { xs: "100%", sm: "auto" } }}
                            justifyContent={
                                isSm ? "space-between" : "flex-start"
                            }
                            alignItems="center"
                            spacing={isSm ? 0 : 1}
                            direction="row"
                        >
                            {Object.values(buttonActions).map((action) => (
                                <Button
                                    data-testid="select-action-button"
                                    aria-label={`Selection ${action}`}
                                    key={action}
                                    size="small"
                                    onClick={() => {
                                        handleActionClick(action);
                                    }}
                                    disabled={checkButtonDisabled(action)}
                                >
                                    {action}
                                </Button>
                            ))}
                            {isMd && dotsMenu}
                        </Stack>
                    )}
                    {!isSm && <Divider orientation="vertical" flexItem />}
                    {!isSm && Object.keys(selectedItems).length !== 0 && (
                        <Typography fontWeight="bold">
                            {Object.keys(selectedItems).length} selected
                        </Typography>
                    )}
                    <LoadingSpinner
                        sx={{
                            position: {
                                xs: "absolute",
                                sm: "relative",
                            },
                            left: { xs: 10, sm: "auto" },
                            bottom: { xs: 60, sm: "auto" },
                        }}
                        tooltip={
                            !!errorState
                                ? "An error occurred and data may not have been saved"
                                : "Saving..."
                        }
                        delay={800}
                        progress={saveProgress}
                        error={errorState !== null}
                    />
                </Stack>
            </Box>
            <MultipleSelectionActionsDialog
                onCancel={() => setCurrentAction(null)}
                key={currentAction}
                open={currentAction !== null}
                items={selectedItems}
                action={currentAction}
                onConfirmation={handleConfirmation}
            />
        </>
    );
}
export default MultipleSelectionActionsMenu;
