import React from "react";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { ToggleButton } from "@mui/material";
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

const MultipleSelectionCheckbox: React.FC = () => {
    const tabIndex = useSelector(dashboardTabIndexSelector);
    const selectedItemsAll = useSelector(selectedItemsSelector);
    const selectedItems = selectedItemsAll[tabIndex] || {};
    const dashboardFilter = useSelector(dashboardFilterTermSelector);
    const availableSelection = useSelector(availableSelectionItemsSelector);
    const availableSelectionItems = Object.values(availableSelection);
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const dispatch = useDispatch();
    const currentCheckbox = React.useRef<React.ReactElement | null>(null);

    const inSearchMode = dashboardFilteredUser || dashboardFilter;

    function getCheckBox() {
        if (!selectedItems) return <CheckBoxOutlineBlankIcon />;
        if (inSearchMode) return currentCheckbox.current;
        const values = Object.values(selectedItems);
        let result = null;
        if (availableSelectionItems.length === 0) {
            result = <CheckBoxOutlineBlankIcon />;
        } else if (values && values.length === availableSelectionItems.length) {
            result = <CheckBoxIcon />;
        } else if (values && values.length > 0) {
            result = <IndeterminateCheckBoxIcon />;
        } else {
            result = <CheckBoxOutlineBlankIcon />;
        }
        currentCheckbox.current = result;
        return result;
    }

    function handleOnClickCheck() {
        if (selectedItems && Object.values(selectedItems).length > 0) {
            dispatch(selectionActions.clearItems(tabIndex));
        } else {
            dispatch(selectionActions.selectAllItems());
        }
    }

    return (
        <ToggleButton
            aria-label="Select All"
            value="check"
            selected={
                !inSearchMode &&
                selectedItems &&
                Object.values(selectedItems).length > 0
            }
            sx={{ margin: 0.5 }}
            size="small"
            onClick={handleOnClickCheck}
            disabled={
                inSearchMode ||
                Object.values(availableSelectionItems).length === 0
            }
        >
            {getCheckBox()}
        </ToggleButton>
    );
};

export default MultipleSelectionCheckbox;
