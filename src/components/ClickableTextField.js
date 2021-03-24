import React, {useEffect, useRef, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {TextField} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types"
import {TelephoneTextFieldControlled} from "./TextFields";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
    text: {
        maxWidth: 300,
        [theme.breakpoints.down("md")]: {
            maxWidth: 250
        }
    },
    label: {
        fontStyle: "italic",
        color: "gray",
        "&:hover": {
            background: theme.palette.type === "dark"  ? "rgb(100, 100, 100)" : "rgb(242, 242, 242)"
        }
    },
    hoverHighlight: {
        "&:hover": {
            background: theme.palette.type === "dark"  ? "rgb(100, 100, 100)" : "rgb(242, 242, 242)"
        }
    }
}));

function ClickableTextField(props) {
    const [editMode, setEditMode] = useState(false);
    const firstValue = useRef(props.value)

    const classes = useStyles();

    function onChange(e) {
        const result = e.target.value
        props.onChange(result);
    }

    function onFinishedEntry() {
        setEditMode(false);
        props.onFinished();
        firstValue.current = props.value;
    }

    function toggleEditMode() {
        if (!props.disabled) {
            setEditMode(!editMode)
        }
    }

    useEffect(() => firstValue.current = props.value, [props.value])

    const stuff = props.disabled ?
        props.value ?
            <Typography
                noWrap
                className={classes.text}
                onClick={toggleEditMode}
                align={"right"}>
                {props.value}
            </Typography> :
            <></> :
        props.value ?
            <Typography
                noWrap
                className={clsx(classes.hoverHighlight, classes.text)}
                align={"right"}
                onClick={toggleEditMode}>
                {props.value}
            </Typography> :
            <Typography
                noWrap
                onClick={toggleEditMode}
                className={clsx(classes.label, classes.text)}
                align={"right"}>
                {props.label}
            </Typography>

    if (editMode) {
        if (props.telephone) {
            return (
                <TelephoneTextFieldControlled
                    margin="dense"
                    onKeyUp={(ev) => {
                        switch(ev.key) {
                            case "Enter": {
                                onFinishedEntry()
                                ev.preventDefault();
                                break;
                            }
                            case "Escape": {
                                onChange({target: {value: firstValue.current}});
                                setEditMode(false);
                                ev.preventDefault();
                                break;
                            }
                            default:
                                break;
                        }
                    }}
                    className={classes.root}
                    autoFocus={true}
                    onBlur={onFinishedEntry}
                    value={props.value}
                    InputProps={{ disableUnderline: true }}
                    onChange={onChange}/>

            )
        } else {
            return (
                <TextField
                    margin="dense"
                    className={clsx(classes.label, classes.text)}
                    onKeyUp={(ev) => {
                        switch (ev.key) {
                            case "Enter": {
                                onFinishedEntry()
                                setEditMode(false);
                                ev.preventDefault();
                                break;
                            }
                            case "Escape": {
                                onChange({target: {value: firstValue.current}});
                                setEditMode(false);
                                ev.preventDefault();
                                break;
                            }
                            default:
                                break;
                        }
                    }}
                    autoFocus={true}
                    onBlur={onFinishedEntry}
                    value={props.value}
                    InputProps={{disableUnderline: true}}
                    onChange={onChange}/>
            )
        }

    } else {
        return (
            <React.Fragment>
                {stuff}
            </React.Fragment>
        )
    }
}

ClickableTextField.propTypes = {
    value: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    telephone: PropTypes.bool,
    onFinished: PropTypes.func

}

ClickableTextField.defaultProps = {
    value: "",
    disabled: false,
    label: "Click to edit",
    onChange: () => {},
    onFinished: () => {},
    telephone: false
}

export default ClickableTextField;
