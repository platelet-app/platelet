import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";

export function EditModeToggleButton(props) {
    return (
        props.value ?
            <Tooltip title={props.tooltipEdit || "Cancel"}>
                <IconButton
                    color="inherit"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={() => props.onChange(false)}>
                    <EditIcon/>
                </IconButton>
            </Tooltip>
            :
            <Tooltip title={props.tooltipDefault || "Edit"}>
                <IconButton
                    color="gray"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={() => props.onChange(true)}>
                    <EditIcon/>
                </IconButton>
            </Tooltip>

    )
}
