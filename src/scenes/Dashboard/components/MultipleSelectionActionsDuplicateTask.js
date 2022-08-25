import React from "react";
import { Stack, ToggleButton, Typography } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { duplicateFields } from "./MultipleSelectionActionsDialog";
import { useSelector } from "react-redux";
import { getRoleView } from "../../../redux/Selectors";
import _ from "lodash";

function MultipleSelectionActionsDuplicateTask({ options, onChange }) {
    const roleView = useSelector(getRoleView);
    let fields;
    if (roleView === "ALL") {
        fields = duplicateFields;
    } else {
        fields = _.omit(duplicateFields, "assignMe");
    }
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
        </Stack>
    );
}

export default MultipleSelectionActionsDuplicateTask;
