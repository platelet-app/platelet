import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import {TextField} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const styles = makeStyles({
    root: {
        background: "white"
    },
});

export function ClickableTextField(props) {
    const [value, setValue] = useState(props.value);
    const [editMode, setEditMode] = useState(false);
    const classes = styles();


    function toggleEditMode() {
        if (!props.disabled) {
            setEditMode(!editMode)
        }
    }

    if (editMode) {
        return (
            <TextField
                className={classes.root}
                autoFocus={true}
                onBlur={toggleEditMode}
                value={value}
                InputProps={{ disableUnderline: true }}
                onChange={e => setValue(e.target.value)}/>
        )

    } else {
        return (
            <Typography onClick={toggleEditMode}>{value}</Typography>
        )
    }
}
