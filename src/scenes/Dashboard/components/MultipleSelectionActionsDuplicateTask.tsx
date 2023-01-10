import React from "react";
import { useTheme, Stack, ToggleButton, Typography } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
    duplicateFields,
    DuplicateStateType,
} from "./MultipleSelectionActionsDialog";
import { useSelector } from "react-redux";
import { getRoleView } from "../../../redux/Selectors";
import _ from "lodash";

type MultipleSelectionActionsDuplicateTaskProps = {
    options: DuplicateStateType;
    onChange?: (...args: any[]) => any;
    showHint?: boolean;
};

const MultipleSelectionActionsDuplicateTask: React.FC<MultipleSelectionActionsDuplicateTaskProps> =
    ({ options, onChange = () => {}, showHint = true }) => {
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
                            value={options[key as keyof DuplicateStateType]}
                            onClick={() => onChange(key)}
                        >
                            {options[key as keyof DuplicateStateType] ? (
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
    };

export default MultipleSelectionActionsDuplicateTask;
