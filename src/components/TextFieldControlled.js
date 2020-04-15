import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";

export function TextFieldControlled(props) {
    const [currentValue, setCurrentValue] = useState(props.forceUppercase && props.value ? props.value.toUpperCase() : props.value);
    return (
        <TextField
            margin="dense"
            id={props.id}
            label={props.label}
            type="text"
            value={currentValue || ''}
            InputProps={{
                maxLength: props.maxLength,
                readOnly: props.readOnly,
                disableUnderline: props.readOnly
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
            {...props}
            margin="dense"
            id={props.id}
            label={props.label}
            type="text"
            value={props.value || ''}
            onSelect={props.onSelect}
            InputProps={{
                maxLength: props.maxLength,
                readOnly: props.readOnly,
                disableUnderline: props.readOnly
            }}
            onChange={props.onChange}
            disabled={props.disabled ? props.disabled : false}
        />
    )
}
