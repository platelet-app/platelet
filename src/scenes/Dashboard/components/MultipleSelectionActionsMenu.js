import React, { useEffect, useRef, useState } from "react";
import * as selectionModeActions from "../../../redux/selectionMode/selectionModeActions";
import { setDashboardFilteredUser } from "../../../redux/Actions";
import { useTheme } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import {
    Box,
    Button,
    Divider,
    IconButton,
    Stack,
    ToggleButton,
    useMediaQuery,
    Typography,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useDispatch, useSelector } from "react-redux";
import * as selectionActions from "../../../redux/selectionMode/selectionModeActions";
import {
    availableSelectionItemsSelector,
    dashboardFilteredUserSelector,
    dashboardFilterTermSelector,
    dashboardTabIndexSelector,
    selectedItemsSelector,
} from "../../../redux/Selectors";
import { tasksStatus } from "../../../apiConsts";
import { DataStore } from "aws-amplify";
import MultipleSelectionActionsDialog from "./MultipleSelectionActionsDialog";
import LoadingSpinner from "../../../components/LoadingSpinner";
import _ from "lodash";

export const actions = {
    assignUser: "Assign User",
    markPickedUp: "Picked Up",
    markDelivered: "Delivered",
    markRiderHome: "Rider Home",
};
export const dotActions = {
    markCancelled: "Cancelled",
    markRejected: "Rejected",
};

const initialState = {
    mouseX: null,
    mouseY: null,
};

function MultipleSelectionActionsMenu() {
    const selectedItemsAll = useSelector(selectedItemsSelector);
    const availableSelection = useSelector(availableSelectionItemsSelector);
    const availableSelectionItems = Object.values(availableSelection);
    const tabIndex = useSelector(dashboardTabIndexSelector);
    const dashboardFilter = useSelector(dashboardFilterTermSelector);
    const [state, setState] = useState(initialState);
    const selectedItems = selectedItemsAll[tabIndex] || {};
    const [currentAction, setCurrentAction] = useState(null);
    const [saveProgress, setSaveProgress] = useState(null);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const isMd = useMediaQuery(theme.breakpoints.down("md"));
    const [errorState, setErrorState] = useState(null);
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const availableItemsWithoutFilterRef = useRef(availableSelectionItems);

    const handleClick = (event) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };
    const handleClose = (e) => {
        e.preventDefault();
        setState(initialState);
    };

    useEffect(() => {
        if (!dashboardFilteredUser) {
            // keeps the icon checked if all items were selected
            availableItemsWithoutFilterRef.current = availableSelectionItems;
        }
    }, [dashboardFilteredUser, availableSelectionItems]);

    function checkButtonDisabled(action) {
        if (!selectedItems) return true;
        const values = Object.values(selectedItems);
        if (action === actions.assignUser) {
            return values.length === 0;
        }
        if (
            values.some((item) => {
                return [
                    tasksStatus.completed,
                    tasksStatus.cancelled,
                    tasksStatus.abandoned,
                    tasksStatus.rejected,
                ].includes(item.status);
            })
        ) {
            return true;
        }
        if (action === actions.markPickedUp) {
            return (
                values.length === 0 ||
                values.some((item) => {
                    return item.status !== tasksStatus.active;
                })
            );
        }
        if (action === actions.markDelivered) {
            return (
                values.length === 0 ||
                values.some((item) => {
                    return item.status !== tasksStatus.pickedUp;
                })
            );
        }
        if (action === actions.markRiderHome) {
            return (
                values.length === 0 ||
                values.some((item) => {
                    return item.status !== tasksStatus.droppedOff;
                })
            );
        }
        if (
            [dotActions.markCancelled, dotActions.markRejected].includes(action)
        ) {
            return (
                values.length === 0 ||
                values.some((item) => {
                    return item.status === tasksStatus.droppedOff;
                })
            );
        }
    }
    function getCheckBox() {
        if (!selectedItems) return <CheckBoxOutlineBlankIcon />;
        const values = Object.values(selectedItems);
        if (availableSelectionItems.length === 0) {
            return <CheckBoxOutlineBlankIcon />;
        } else if (values && values.length === availableSelectionItems.length) {
            return <CheckBoxIcon />;
        } else if (
            values &&
            dashboardFilteredUser &&
            values.length === availableItemsWithoutFilterRef.current.length
        ) {
            return <CheckBoxIcon />;
        } else if (values && values.length > 0) {
            return <IndeterminateCheckBoxIcon />;
        } else {
            return <CheckBoxOutlineBlankIcon />;
        }
    }
    function handleOnClickCheck() {
        if (selectedItems && Object.values(selectedItems).length > 0) {
            dispatch(selectionActions.clearItems(tabIndex));
        } else {
            dispatch(selectionActions.selectAllItems());
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
                {Object.values(dotActions).map((action) => {
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

    function handleActionClick(action) {
        setCurrentAction(action);
    }

    function saveModels(models) {
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

    async function handleConfirmation(models) {
        setCurrentAction(null);
        dispatch(selectionActions.setSelectionActionsPending(true));
        await saveModels(models);
        dispatch(selectionModeActions.clearItems(tabIndex));
        dispatch(selectionActions.setSelectionActionsPending(false));
    }

    const dispatch = useDispatch();

    const buttonActions = isMd ? actions : { ...actions, ...dotActions };

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
                    <Typography sx={{ margin: 0.5 }} fontWeight="bold">
                        You have {Object.keys(selectedItems).length} selected{" "}
                        {Object.keys(selectedItems).length > 1
                            ? "items"
                            : "item"}
                    </Typography>
                )}
                <Stack
                    sx={{ minHeight: 50 }}
                    alignItems="center"
                    spacing={2}
                    direction="row"
                >
                    {!isSm && (
                        <ToggleButton
                            aria-label="Select All"
                            sx={{ margin: 0.5 }}
                            size="small"
                            onClick={handleOnClickCheck}
                            disabled={
                                !!dashboardFilter ||
                                !!dashboardFilteredUser ||
                                Object.values(availableSelectionItems)
                                    .length === 0
                            }
                        >
                            {getCheckBox()}
                        </ToggleButton>
                    )}
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
                                    data-testId="select-action-button"
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
                            {Object.keys(selectedItems).length}{" "}
                            {Object.keys(selectedItems).length === 1
                                ? "item"
                                : "items"}{" "}
                            selected
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
                open={currentAction !== null}
                items={selectedItems}
                action={currentAction}
                onConfirmation={handleConfirmation}
            />
        </>
    );
}

export default MultipleSelectionActionsMenu;
