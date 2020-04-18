import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";

export function TextFieldControlled(props) {
    const [currentValue, setCurrentValue] = useState(props.forceUppercase && props.value ? props.value.toUpperCase() : props.value);
    return (
        <TextField
            style={props.style}
            key={props.key}
            margin="dense"
            multiline={props.multiline}
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
                if (props.onChange)
                    props.onChange(e);
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
            type="text"
            value={props.value || ''}
            InputProps={{
                maxLength: props.maxLength,
                readOnly: props.readOnly,
                disableUnderline: props.readOnly
            }}
        />
    )
}
