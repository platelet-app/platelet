import React, { useEffect, useRef, useState } from "react";
import * as selectionModeActions from "../../../redux/selectionMode/selectionModeActions";
import { useTheme } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import {
    Button,
    Dialog,
    Divider,
    IconButton,
    Paper,
    Stack,
    ToggleButton,
    useMediaQuery,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useDispatch, useSelector } from "react-redux";
import * as selectionActions from "../../../redux/selectionMode/selectionModeActions";
import {
    availableSelectionItemsSelector,
    dashboardFilterTermSelector,
    dashboardTabIndexSelector,
    selectedItemsSelector,
} from "../../../redux/Selectors";
import { tasksStatus, userRoles } from "../../../apiConsts";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import MultipleSelectionActionsAssignUser from "./MultipleSelectionActionsAssignUser";
import { DataStore } from "aws-amplify";

const actions = {
    assignUser: "Assign User",
    markPickedUp: "Picked Up",
    markDelivered: "Delivered",
    markRiderHome: "Rider Home",
};

const dotActions = {
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
    const selectedItems = selectedItemsAll[tabIndex];
    const [currentAction, setCurrentAction] = useState(null);
    const saveData = useRef([]);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

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
                            onClick={() => {}}
                        >
                            {action}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );

    function handleActionClick(action) {
        if (action === actions.assignUser) {
            setCurrentAction(action);
        } else if (action === actions.markPickedUp) {
        } else if (action === actions.markDelivered) {
        } else if (action === actions.markRiderHome) {
        } else if (action === actions.markCancelled) {
        } else if (action === actions.markRejected) {
        }
    }

    function saveModels() {
        return Promise.all(
            saveData.current.map((model) => DataStore.save(model))
        );
    }

    async function handleConfirmation() {
        await saveModels();
        dispatch(selectionModeActions.clearItems(tabIndex));
        setCurrentAction(null);
    }

    const dialogContents =
        currentAction === actions.assignUser ? (
            <Paper sx={{ padding: 2, minWidth: 500, minHeight: 300 }}>
                <MultipleSelectionActionsAssignUser
                    selectedItems={selectedItems}
                    onChange={(items) => {
                        console.log(items);
                        saveData.current = items;
                    }}
                />
            </Paper>
        ) : null;

    const dispatch = useDispatch();
    return (
        <>
            <Stack
                alignItems="center"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
                direction="row"
            >
                <ToggleButton
                    aria-label="Select All"
                    sx={{ margin: 0.5 }}
                    size="small"
                    onClick={handleOnClickCheck}
                    disabled={!!dashboardFilter}
                >
                    {getCheckBox()}
                </ToggleButton>
                {selectedItems && Object.values(selectedItems).length > 0 && (
                    <>
                        {Object.values(actions).map((action) => (
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
                        {dotsMenu}
                    </>
                )}
            </Stack>
            <ConfirmationDialog
                onCancel={() => setCurrentAction(null)}
                open={!!currentAction}
                fullScreen={isSm}
                onConfirmation={handleConfirmation}
            >
                {dialogContents}
            </ConfirmationDialog>
        </>
    );
}

export default MultipleSelectionActionsMenu;
