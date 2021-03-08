import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {parsePhoneNumberFromString} from 'libphonenumber-js'
import OutlinedInput from "@material-ui/core/OutlinedInput";


export function TextFieldControlled(props) {
    const [currentValue, setCurrentValue] = useState(props.forceUppercase && props.value ? props.value.toUpperCase() : props.value);
    const {forceUppercase, onChange, ...newProps} = props;
    useEffect(() => setCurrentValue(props.value), [props.value])
    return (
        <TextField
            {...newProps}
            margin="dense"
            onKeyUp={(ev) => {
                switch (ev.key) {
                    case "Enter": {
                        if (props.onPressEnter)
                            props.onPressEnter(ev);
                        ev.preventDefault();
                        break;
                    }
                    case "Escape": {
                        setCurrentValue("");
                        props.onChange({target: {value: ""}});
                        ev.preventDefault();
                        break;
                    }
                    default:
                        break;
                }
            }}
            value={currentValue || ''}
            onChange={e => {
                setCurrentValue(forceUppercase ? e.target.value.toUpperCase() : e.target.value);
                if (onChange)
                    onChange(e);
            }}
        />
    )
}

export function TelephoneTextFieldControlled(props) {
    const [currentValue, setCurrentValue] = useState(props.value ? props.value : "");
    const [errorState, setErrorState] = useState(false);

    function validateNumber() {
        if (typeof (currentValue) === "string") {
            const parsedNumber = parsePhoneNumberFromString(currentValue, "GB")
            if (parsedNumber)
                setErrorState(!parsedNumber.isValid())
        }
    }

    useEffect(validateNumber, [currentValue])
    return (
        <TextField
            {...props}
            type={"tel"}
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
    const multiline = props.multiline;
    if (multiline) {
        return (
            <TextField
                {...props}
                onKeyPress={(ev) => {
                    if (ev.key === "Escape") {

                        if (props.onPressEscape) {
                            props.onPressEscape()
                            ev.preventDefault();
                        }
                    }
                }}
                margin="dense"
                value={props.value || ''}
            />

        )
    } else {
        return (
            <TextField
                {...props}
                onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                        if (props.onPressEnter)
                            props.onPressEnter(ev);
                        ev.preventDefault();
                    } else if (ev.key === "Escape") {

                        if (props.onPressEscape) {
                            props.onPressEscape()
                            ev.preventDefault();
                        }
                    }
                }}
                margin="dense"
                value={props.value || ''}
            />
        )
    }
}
