import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import {TextField} from "@material-ui/core";

export function ClickableTextField(props) {
    const [value, setValue] = useState(props.value);
    const [editMode, setEditMode] = useState(false);

    function toggleEditMode() {
        if (!props.disabled) {
            setEditMode(!editMode)
        }
    }

    if (editMode) {
        return (
            <TextField autoFocus={true} onBlur={toggleEditMode} value={value} onChange={e => setValue(e.target.value)}/>
        )

    } else {
        return (
            <Typography onClick={toggleEditMode}>{value}</Typography>
        )
    }
}
