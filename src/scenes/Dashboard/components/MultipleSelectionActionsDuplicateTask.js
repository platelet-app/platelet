import React from "react";
import { useTheme, Stack, ToggleButton, Typography } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { duplicateFields } from "./MultipleSelectionActionsDialog";
import { useSelector } from "react-redux";
import { getRoleView } from "../../../redux/Selectors";
import _ from "lodash";
import PropTypes from "prop-types";

function MultipleSelectionActionsDuplicateTask({
    options,
    onChange,
    showHint,
}) {
    const roleView = useSelector(getRoleView);
    let fields;
    if (roleView === "ALL") {
        fields = duplicateFields;
    } else {
        fields = _.omit(duplicateFields, "assignMe");
    }
    const theme = useTheme();
    return (
        <Stack direction="column" spacing={1}>
            {Object.entries(fields).map(([key, label]) => (
                <Stack
                    direction="row"
                    key={key}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography>{label}</Typography>
                    <ToggleButton
                        aria-label={label}
                        value={options[key]}
                        onClick={() => onChange(key)}
                    >
                        {options[key] ? (
                            <CheckBoxIcon />
                        ) : (
                            <CheckBoxOutlineBlankIcon />
                        )}
                    </ToggleButton>
                </Stack>
            ))}
            {showHint && (
                <Typography
                    sx={{
                        fontStyle: "italic",
                        maxWidth: "100%",
                        width: "90%",
                        color: "gray",
                        "&:hover": {
                            color:
                                theme.palette.mode === "dark"
                                    ? "white"
                                    : "black",
                        },
                    }}
                >
                    Picked up and delivered times will not be copied.
                </Typography>
            )}
        </Stack>
    );
}

MultipleSelectionActionsDuplicateTask.propTypes = {
    options: PropTypes.object,
    onChange: PropTypes.func,
    showHint: PropTypes.bool,
};

MultipleSelectionActionsDuplicateTask.defaultProps = {
    options: {
        copyAssignees: false,
        copyComments: false,
        assignMe: true,
    },
    onChange: () => {},
    showHint: false,
};

export default MultipleSelectionActionsDuplicateTask;
