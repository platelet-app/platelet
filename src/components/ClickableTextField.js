import React, {useEffect, useRef, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {TextField} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types"
import {TelephoneTextFieldControlled} from "./TextFields";

const useStyles = makeStyles({
    textfield: {
        background: "white"
    },
    label: {
        fontStyle: "italic",
        color: "gray",
        "&:hover": {
            background: "rgb(242, 242, 242)"
        }
    },
    hoverHighlight: {
        background: "white",
        color: "black",
        "&:hover": {
            background: "rgb(242, 242, 242)"
        }
    }
});

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

    const stuff = props.disabled ?
        props.value ?
            <Typography onClick={toggleEditMode}>{props.value}</Typography> :
            <Typography onClick={toggleEditMode}>{props.label}</Typography> :
        props.value ?
            <Typography className={classes.hoverHighlight} onClick={toggleEditMode}>{props.value}</Typography> :
            <Typography onClick={toggleEditMode} className={classes.label}>{props.label}</Typography>

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
                    className={classes.textfield}
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
