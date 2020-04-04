import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";

export function TextFieldControlled(props) {
    const [currentValue, setCurrentValue] = useState(props.forceUppercase ? props.value.toUpperCase() : props.value);
    return (
        <TextField
            margin="dense"
            id={props.id}
            label={props.label}
            type="text"
            fullWidth
            value={currentValue || ''}
            inputProps={{
                maxLength: props.maxLength
            }}
            onChange={e => {
                setCurrentValue(props.forceUppercase ? e.target.value.toUpperCase() : e.target.value);
                props.onSelect(e)
            }}
            disabled={props.disabled ? props.disabled : false}
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
            disabled={props.disabled ? props.disabled : false}
        />
    )
}
