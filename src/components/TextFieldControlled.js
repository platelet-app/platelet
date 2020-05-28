import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import { parsePhoneNumberFromString } from 'libphonenumber-js'


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
            onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                    if (props.onPressEnter)
                        props.onPressEnter(ev);
                    ev.preventDefault();
                }
            }}
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

export function TelephoneTextFieldControlled(props) {
    const [currentValue, setCurrentValue] = useState(props.value);
    const [errorState, setErrorState] = useState(false);

    function validateNumber() {
        console.log(currentValue)
        if (typeof(currentValue) === "string") {
            const parsedNumber = parsePhoneNumberFromString(currentValue, "GB")
            if (parsedNumber)
                setErrorState(!parsedNumber.isValid())
        }
    }
    useEffect(validateNumber, [currentValue])
    return (
        <TextField
            {...props}
            error={errorState}
            helperText={errorState ? "Not a valid telephone number" : ""}
            onChange={e => {
                const result = e.target.value.split("").filter(val => (Number.isInteger(parseInt(val)) || val === " " || val === "+" || val === "0"))
                const joined = result.join("")
                setCurrentValue(joined);
                if (props.onChange) {
                    e.target.value = joined
                    props.onChange(e);
                }
            }}
            value={currentValue}
            margin="dense"
            InputProps={{
                maxLength: props.maxLength,
                readOnly: props.readOnly,
                disableUnderline: props.readOnly
            }}
        />
    )
}

export function TextFieldUncontrolled(props) {
    return (
        <TextField
            {...props}
            onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                    if (props.onPressEnter)
                        props.onPressEnter();
                    ev.preventDefault();
                }
            }}
            margin="dense"
            value={props.value || ''}
            InputProps={{
                maxLength: props.maxLength,
                readOnly: props.readOnly,
                disableUnderline: props.readOnly
            }}
        />
    )
}
