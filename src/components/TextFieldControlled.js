import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";

export function TextFieldControlled(props) {
    const [currentValue, setCurrentValue] = useState(props.value);
    return (
        <TextField
            margin="dense"
            id={props.id}
            label={props.label}
            type="text"
            fullWidth
            value={currentValue || ''}
            onSelect={props.onSelect}
            onChange={e => {
                setCurrentValue(e.target.value);
            }}
        />
    )
}

export function TextFieldUncontrolled(props) {
    return (
        <TextField
            margin="dense"
            id={props.id}
            label={props.label}
            type="text"
            fullWidth
            value={props.value || ''}
            onSelect={props.onSelect}
            onChange={props.onChange}
        />
    )
}
