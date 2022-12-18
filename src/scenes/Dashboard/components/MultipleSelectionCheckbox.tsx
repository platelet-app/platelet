import React, { useRef } from "react";
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
import _ from "lodash";

type MultipleSelectionCheckboxProps = {
    disabled: boolean;
};

const MultipleSelectionCheckbox: React.FC<MultipleSelectionCheckboxProps> =
    () => {
        const tabIndex = useSelector(dashboardTabIndexSelector);
        const selectedItemsAll = useSelector(selectedItemsSelector);
        const selectedItems = selectedItemsAll[tabIndex] || {};
        const dashboardFilter = useSelector(dashboardFilterTermSelector);
        const availableSelection = useSelector(availableSelectionItemsSelector);
        const availableSelectionItems = Object.values(availableSelection);
        const dashboardFilteredUser = useSelector(
            dashboardFilteredUserSelector
        );
        const availableItemsWithoutFilterRef = useRef(availableSelectionItems);
        const dispatch = useDispatch();

        function getCheckBox() {
            if (!selectedItems) return <CheckBoxOutlineBlankIcon />;
            const values = Object.values(selectedItems);
            if (availableSelectionItems.length === 0) {
                return <CheckBoxOutlineBlankIcon />;
            } else if (
                values &&
                values.length === availableSelectionItems.length
            ) {
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

        return (
            <ToggleButton
                aria-label="Select All"
                value="check"
                selected={
                    selectedItems && Object.values(selectedItems).length > 0
                }
                sx={{ margin: 0.5 }}
                size="small"
                onClick={handleOnClickCheck}
                disabled={
                    !!dashboardFilter ||
                    !!dashboardFilteredUser ||
                    Object.values(availableSelectionItems).length === 0
                }
            >
                {getCheckBox()}
            </ToggleButton>
        );
    };

export default MultipleSelectionCheckbox;
