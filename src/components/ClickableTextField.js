import React, { useEffect, useRef, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types";
import { TextFieldUncontrolled } from "./TextFields";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    text: {
        maxWidth: 300,
        [theme.breakpoints.down("md")]: {
            maxWidth: 250,
        },
    },
    label: {
        fontStyle: "italic",
        color: "gray",
        "&:hover": {
            background:
                theme.palette.type === "dark"
                    ? "rgb(100, 100, 100)"
                    : "rgb(242, 242, 242)",
        },
    },
    hoverHighlight: {
        "&:hover": {
            background:
                theme.palette.type === "dark"
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
            className={clsx(classes.hoverHighlight, classes.text)}
            align={"right"}
            onClick={toggleEditMode}
        >
            {value}
        </Typography>
    ) : (
        <Typography
            noWrap
            onClick={toggleEditMode}
            className={clsx(classes.label, classes.text)}
            align={"right"}
        >
            {props.label}
        </Typography>
    );

    if (editMode) {
        return (
            <TextFieldUncontrolled
                margin="dense"
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
                InputProps={{ disableUnderline: true }}
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
    label: "Click to edit",
    onChange: () => {},
    onFinished: () => {},
    tel: false,
};

export default ClickableTextField;
