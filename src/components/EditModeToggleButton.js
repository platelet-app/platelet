import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";

export function EditModeToggleButton(props) {
    return props.value ? (
        <Tooltip title={props.tooltipEdit || "Cancel"}>
            <IconButton
                color="primary"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => props.onChange(false)}
                size="large"
            >
                <EditIcon />
            </IconButton>
        </Tooltip>
    ) : (
        <Tooltip title={props.tooltipDefault || "Edit"}>
            <IconButton
                color="secondary"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => props.onChange(true)}
                size="large"
            >
                <EditIcon />
            </IconButton>
        </Tooltip>
    );
}
