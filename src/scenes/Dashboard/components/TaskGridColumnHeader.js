import React from "react";
import PropTypes from "prop-types";
import * as selectionActions from "../../../redux/selectionMode/selectionModeActions";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useDispatch, useSelector } from "react-redux";
import {
    dashboardFilterTermSelector,
    dashboardTabIndexSelector,
    selectedItemsSelector,
} from "../../../redux/Selectors";

const useStyles = makeStyles({
    header: {
        fontWeight: "bold",
    },
    headerParent: {
        "&:hover": {
            "& $select": {
                display: "block",
            },
        },
    },
});

function TaskGridColumnHeader(props) {
    const selectedItemsAll = useSelector(selectedItemsSelector);
    const tabIndex = useSelector(dashboardTabIndexSelector);
    const dispatch = useDispatch();
    const dashboardFilter = useSelector(dashboardFilterTermSelector);

    const classes = useStyles();

    function handleSelectCheckBoxClick() {
        const selectedItems = selectedItemsAll[tabIndex] || [];
        if (
            Object.values(props.tasks).some((t) =>
                Object.values(selectedItems)
                    .map((a) => a.id)
                    .includes(t.id)
            )
        ) {
            dispatch(
                selectionActions.unselectMultipleItems(
                    Object.values(props.tasks).map((t) => t.id),
                    tabIndex
                )
            );
        } else {
            dispatch(
                selectionActions.selectMultipleItems(props.tasks, tabIndex)
            );
        }
    }
    function getCheckBox() {
        const selectedItems = selectedItemsAll[tabIndex];
        if (!selectedItems) return <CheckBoxOutlineBlankIcon />;
        const values = Object.values(selectedItems);
        if (
            !Object.values(props.tasks).some((t) =>
                values.map((a) => a.id).includes(t.id)
            )
        ) {
            return <CheckBoxOutlineBlankIcon />;
        } else if (
            !Object.values(props.tasks).some(
                (t) => !values.map((a) => a.id).includes(t.id)
            )
        ) {
            return <CheckBoxIcon />;
        } else if (
            Object.values(props.tasks).some((t) =>
                values.map((a) => a.id).includes(t.id)
            )
        ) {
            return <IndeterminateCheckBoxIcon />;
        }
    }

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            className={classes.headerParent}
        >
            <Typography
                data-cy={`${props.title}-header`}
                className={classes.header}
            >
                {props.title}
            </Typography>
            {!!!dashboardFilter && Object.values(props.tasks).length > 0 && (
                <Box sx={{ height: 0 }}>
                    <IconButton
                        data-testId={`${props.title}-select-all`}
                        onClick={handleSelectCheckBoxClick}
                    >
                        {getCheckBox()}
                    </IconButton>
                </Box>
            )}
        </Stack>
    );
}

TaskGridColumnHeader.propTypes = {
    tasks: PropTypes.object,
};

TaskGridColumnHeader.defaultProps = {
    tasks: {},
};

export default TaskGridColumnHeader;
