import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PropTypes from "prop-types";
import _ from "lodash";

function validateNumber(value) {
    if (typeof value === "string") {
        const parsedNumber = parsePhoneNumberFromString(value, "GB");
        if (parsedNumber) return parsedNumber.isValid();
    }
}

export function TextFieldControlled(props) {
    const [currentValue, setCurrentValue] = useState(
        props.forceUppercase && props.value
            ? props.value.toUpperCase()
            : props.value
    );
    const [errorState, setErrorState] = useState(false);
    const errorText = `Not a valid ${props.tel ? "telephone number" : "email"}`;

    useEffect(() => {
        if (!currentValue) setErrorState(false);
        else if (props.tel && currentValue)
            setErrorState(!validateNumber(currentValue));
    }, [currentValue, props.tel]);

    const {
        forceUppercase,
        onChange,
        onPressEnter,
        onPressEscape,
        toUpperCase,
        tel,
        ...newProps
    } = props;
    useEffect(() => setCurrentValue(props.value), [props.value]);

    return (
        <TextField
            {...newProps}
            margin="dense"
            color={errorState ? "warning" : "primary"}
            helperText={errorState ? errorText : ""}
            onKeyUp={(ev) => {
                switch (ev.key) {
                    case "Enter": {
                        if (props.onPressEnter) props.onPressEnter(ev);
                        ev.preventDefault();
                        break;
                    }
                    case "Escape": {
                        if (props.onPressEscape) props.onPressEscape(ev);
                        else {
                            setCurrentValue("");
                            props.onChange({ target: { value: "" } });
                            ev.preventDefault();
                        }
                        break;
                    }
                    default:
                        break;
                }
            }}
            value={currentValue || ""}
            onChange={(e) => {
                if (props.tel) {
                    const result = e.target.value
                        .split("")
                        .filter(
                            (val) =>
                                Number.isInteger(parseInt(val)) ||
                                val === "+" ||
                                val === "0"
                        );
                    const joined = result.join("");
                    setCurrentValue(joined);
                } else {
                    setCurrentValue(
                        forceUppercase
                            ? e.target.value.toUpperCase()
                            : e.target.value
                    );
                }
                if (onChange) onChange(e);
            }}
        />
    );
}

TextFieldControlled.propTypes = {
    value: PropTypes.string,
    tel: PropTypes.bool,
    toUpperCase: PropTypes.bool,
    onChange: PropTypes.func,
    onPressEnter: PropTypes.func,
    label: PropTypes.string,
};

TextFieldControlled.defaultProps = {
    value: "",
    tel: false,
    toUpperCase: false,
    onChange: () => {},
    onPressEnter: () => {},
    label: "",
};

export function TextFieldUncontrolled(props) {
    const [errorState, setErrorState] = useState(false);
    const multiline = props.multiline;
    const errorText = `Not a valid ${
        props.tel ? "telephone number" : props.email ? "email" : ""
    }`;

    useEffect(() => {
        if (!props.value) setErrorState(false);
        else if (props.tel && props.value !== "")
            setErrorState(!validateNumber(props.value));
    }, [props.value, props.tel]);

    if (multiline && !props.tel) {
        return (
            <TextField
                {..._.omit(props, "tel", "onPressEnter", "onPressEscape")}
                helperText={errorState ? errorText : ""}
                onKeyPress={(ev) => {
                    if (ev.key === "Escape") {
                        if (props.onPressEscape) {
                            props.onPressEscape(ev);
                            ev.preventDefault();
                        }
                    }
                }}
                margin="dense"
                value={props.value || ""}
            />
        );
    } else {
        return (
            <TextField
                {..._.omit(props, "tel", "onPressEnter", "onPressEscape")}
                helperText={errorState ? errorText : ""}
                color={errorState ? "warning" : "primary"}
                type={props.tel ? "tel" : ""}
                onChange={(e) => {
                    if (props.tel) {
                        const result = e.target.value
                            .split("")
                            .filter(
                                (val) =>
                                    Number.isInteger(parseInt(val)) ||
                                    val === " " ||
                                    val === "+" ||
                                    val === "0"
                            );
                        const joined = result.join("");
                        if (props.onChange) {
                            e.target.value = joined;
                            props.onChange(e);
                        }
                    } else {
                        props.onChange(e);
                    }
                }}
                onKeyUp={(ev) => {
                    switch (ev.key) {
                        case "Enter": {
                            if (props.onPressEnter) {
                                props.onPressEnter(ev);
                                ev.preventDefault();
                            }
                            break;
                        }
                        case "Escape": {
                            if (props.onPressEscape) {
                                props.onPressEscape(ev);
                                ev.preventDefault();
                            }
                            break;
                        }
                        default:
                            break;
                    }
                }}
                margin="dense"
                value={props.value || ""}
            />
        );
    }
}

// Not in use, instead use the other textfields and pass in the tel prop
export function TelephoneTextFieldControlled(props) {
    const [currentValue, setCurrentValue] = useState(
        props.value ? props.value : ""
    );
    const [errorState, setErrorState] = useState(false);

    useEffect(
        () => setErrorState(!validateNumber(currentValue)),
        [currentValue]
    );

    return (
        <TextField
            {...props}
            type={"tel"}
            error={errorState}
            helperText={errorState ? "Not a valid telephone number" : ""}
            onChange={(e) => {
                const result = e.target.value
                    .split("")
                    .filter(
                        (val) =>
                            Number.isInteger(parseInt(val)) ||
                            val === " " ||
                            val === "+" ||
                            val === "0"
                    );
                const joined = result.join("");
                setCurrentValue(joined);
                if (props.onChange) {
                    e.target.value = joined;
                    props.onChange(e);
                }
            }}
            value={currentValue}
            margin="dense"
            InputProps={{
                maxLength: props.maxLength,
                readOnly: props.readOnly,
            }}
        />
    );
}
