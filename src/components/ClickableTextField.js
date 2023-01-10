import React, { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import PropTypes from "prop-types";
import { TextFieldUncontrolled } from "./TextFields";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    text: {
        maxWidth: 300,
        [theme.breakpoints.down("lg")]: {
            maxWidth: 250,
        },
    },
    enabled: {
        background:
            theme.palette.mode === "dark" ? "rgb(70, 70, 70)" : "yellow",
    },
    label: {
        fontStyle: "italic",
        color: "gray",
        "&:hover": {
            background:
                theme.palette.mode === "dark"
                    ? "rgb(100, 100, 100)"
                    : "rgb(242, 242, 242)",
        },
    },
    hoverHighlight: {
        "&:hover": {
            background:
                theme.palette.mode === "dark"
                    ? "rgb(100, 100, 100)"
                    : "rgb(242, 242, 242)",
        },
    },
}));

function ClickableTextField(props) {
    const [editMode, setEditMode] = useState(false);
    const [value, setValue] = useState("");
    const firstValue = useRef(props.value);

    const classes = useStyles();

    function onChange(e) {
        props.onChange(e.target.value);
        setValue(e.target.value);
    }

    function onFinishedEntry(ev) {
        setEditMode(false);
        props.onFinished(ev.target.value);
        firstValue.current = ev.target.value;
    }

    function toggleEditMode() {
        if (!props.disabled) {
            setEditMode(!editMode);
        }
    }

    useEffect(() => {
        firstValue.current = props.value;
        setValue(props.value);
    }, [props.value]);

    const label =
        props.disabled && !props.label ? "" : props.label || "Click to edit";

    const stuff = props.disabled ? (
        value ? (
            <Typography
                noWrap
                className={classes.text}
                onClick={toggleEditMode}
                align={"right"}
            >
                {value}
            </Typography>
        ) : (
            <></>
        )
    ) : value ? (
        <Typography
            noWrap
            aria-label={label}
            className={clsx(
                classes.hoverHighlight,
                classes.enabled,
                classes.text
            )}
            align={"right"}
            onClick={toggleEditMode}
        >
            {value}
        </Typography>
    ) : (
        <Typography
            noWrap
            aria-label={label}
            onClick={toggleEditMode}
            className={clsx(
                classes.hoverHighlight,
                classes.label,
                classes.enabled,
                classes.text
            )}
            align={"right"}
        >
            {label}
        </Typography>
    );

    if (editMode) {
        return (
            <TextFieldUncontrolled
                margin="dense"
                variant="standard"
                inputProps={{
                    "aria-label": label,
                }}
                className={clsx(classes.label, classes.text)}
                tel={props.tel}
                onPressEnter={(ev) => {
                    onFinishedEntry(ev);
                    setEditMode(false);
                    ev.stopPropagation();
                }}
                onPressEscape={(ev) => {
                    ev.stopPropagation();
                    onChange({
                        target: { value: firstValue.current },
                    });
                    setEditMode(false);
                }}
                autoFocus={true}
                onBlur={(ev) => onFinishedEntry(ev)}
                value={value}
                onChange={onChange}
            />
        );
    } else {
        return <React.Fragment>{stuff}</React.Fragment>;
    }
}

ClickableTextField.propTypes = {
    value: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    tel: PropTypes.bool,
    onFinished: PropTypes.func,
};

ClickableTextField.defaultProps = {
    value: "",
    disabled: false,
    onChange: () => {},
    onFinished: () => {},
    tel: false,
};

export default ClickableTextField;
