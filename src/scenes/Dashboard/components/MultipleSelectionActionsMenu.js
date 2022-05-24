import React from "react";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { Button, Divider, Stack, ToggleButton } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useDispatch, useSelector } from "react-redux";
import * as selectionActions from "../../../redux/selectionMode/selectionModeActions";
import {
    availableSelectionItemsSelector,
    selectedItemsSelector,
} from "../../../redux/Selectors";

function MultipleSelectionActionsMenu(props) {
    const selectedItems = Object.values(useSelector(selectedItemsSelector));
    const availableSelection = useSelector(availableSelectionItemsSelector);
    const availableSelectionItems = Object.values(availableSelection);

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
            console.log(selectedItems.length);
            dispatch(selectionActions.selectAllItems());
        }
    }

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
            >
                {checkBoxIcon}
            </ToggleButton>
            <Button>Assign</Button>
        </Stack>
    );
}

export default MultipleSelectionActionsMenu;
