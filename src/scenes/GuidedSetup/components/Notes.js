import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Styles } from "../styles";
import {
    Button,
    Chip,
    FormControl,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import { ManualAddress } from "./ManualAddress";
import { LocationDropdownSelector } from "./LocationDropdownSelector";
import DateTimePicker from "@mui/lab/DateTimePicker";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import { commentVisibility } from "../../../apiConsts";

function VisibilityMenu(props) {
    return (
        <Stack direction="row" spacing={1}>
            <Chip
                variant={
                    props.value === commentVisibility.everyone
                        ? "default"
                        : "outlined"
                }
                color={
                    props.value === commentVisibility.everyone
                        ? "primary"
                        : "default"
                }
                onClick={() => props.onChange(commentVisibility.everyone)}
                label={"EVERYONE"}
            />
            <Chip
                variant={
                    props.value === commentVisibility.me
                        ? "default"
                        : "outlined"
                }
                color={
                    props.value === commentVisibility.me ? "primary" : "default"
                }
                onClick={() => props.onChange(commentVisibility.me)}
                label={"ONLY ME"}
            />
        </Stack>
    );
}

export const Notes = ({ values, onChange, handleVisibilityChange }) => {
    const classes = Styles();

    return (
        <div className={classes.block}>
            <Typography variant="h6" gutterBottom>
                {"Who should the notes be visible to?"}
            </Typography>
            <VisibilityMenu
                value={values.visibility}
                onChange={handleVisibilityChange}
            />
            <TextField
                id="notes"
                label="Notes"
                fullWidth
                multiline
                value={values.body}
                onChange={(e) => onChange(e.target.value)}
                className={classes.textField}
                margin="normal"
            />
        </div>
    );
};
