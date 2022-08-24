import React from "react";
import { Stack, ToggleButton, Typography } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { duplicateFields } from "./MultipleSelectionActionsDialog";

function MultipleSelectionActionsDuplicateTask({ options, onChange }) {
    return (
        <Stack direction="column" spacing={1}>
            {Object.entries(duplicateFields).map(([key, label]) => (
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
