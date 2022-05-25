import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import {
    Button,
    Divider,
    IconButton,
    Stack,
    ToggleButton,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useDispatch, useSelector } from "react-redux";
import * as selectionActions from "../../../redux/selectionMode/selectionModeActions";
import {
    availableSelectionItemsSelector,
    dashboardFilterTermSelector,
    selectedItemsSelector,
} from "../../../redux/Selectors";
import { tasksStatus } from "../../../apiConsts";

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
    const selectedItems = Object.values(useSelector(selectedItemsSelector));
    const availableSelection = useSelector(availableSelectionItemsSelector);
    const availableSelectionItems = Object.values(availableSelection);
    const dashboardFilter = useSelector(dashboardFilterTermSelector);
    const [state, setState] = useState(initialState);

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
        if (action === actions.assignUser) {
            return selectedItems.length === 0;
        }
        if (action === actions.markPickedUp) {
            return (
                selectedItems.length === 0 ||
                selectedItems.some((item) => {
                    return item.status !== tasksStatus.active;
                })
            );
        }
        if (action === actions.markDelivered) {
            return (
                selectedItems.length === 0 ||
                selectedItems.some((item) => {
                    return item.status !== tasksStatus.pickedUp;
                })
            );
        }
        if (action === actions.markRiderHome) {
            return (
                selectedItems.length === 0 ||
                selectedItems.some((item) => {
                    return item.status !== tasksStatus.droppedOff;
                })
            );
        }
        if (
            [dotActions.markCancelled, dotActions.markRejected].includes(action)
        ) {
            return (
                selectedItems.length === 0 ||
                selectedItems.some((item) => {
                    return item.status === tasksStatus.droppedOff;
                })
            );
        }
    }

    let checkBoxIcon = <CheckBoxOutlineBlankIcon />;

    if (availableSelectionItems.length === 0) {
        checkBoxIcon = <CheckBoxOutlineBlankIcon />;
    } else if (selectedItems.length === availableSelectionItems.length) {
        checkBoxIcon = <CheckBoxIcon />;
    } else if (selectedItems.length > 0) {
        checkBoxIcon = <IndeterminateCheckBoxIcon />;
    }

    function handleOnClickCheck() {
        if (selectedItems.length > 0) {
            dispatch(selectionActions.clearItems());
        } else {
            dispatch(selectionActions.selectAllItems());
        }
    }

    const dotsMenu = (
        <>
            <IconButton
                aria-label="more-selection-actions"
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

    const dispatch = useDispatch();
    return (
        <Stack
            alignItems="center"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            direction="row"
        >
            <ToggleButton
                sx={{ margin: 0.5 }}
                size="small"
                onClick={handleOnClickCheck}
                disabled={!!dashboardFilter}
            >
                {checkBoxIcon}
            </ToggleButton>
            {Object.values(actions).map((action) => (
                <Button
                    key={action}
                    size="small"
                    onClick={() => {}}
                    disabled={checkButtonDisabled(action)}
                >
                    {action}
                </Button>
            ))}
            {dotsMenu}
        </Stack>
    );
}

export default MultipleSelectionActionsMenu;
