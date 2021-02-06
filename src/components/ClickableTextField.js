import React, {useRef, useState} from "react";
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
            background: "grey"
        }
    }
});

function ClickableTextField(props) {
    const [value, setValue] = useState(props.value);
    const [editMode, setEditMode] = useState(false);
    const firstValue = useRef(props.value)

    const classes = useStyles();

    function onChange(e) {
        const result = e.target.value
        setValue(result);
        props.onChange(result);
    }

    function toggleEditMode() {
        if (!props.disabled) {
            setEditMode(!editMode)
        }
    }

    const stuff = value ?
        <Typography className={classes.hoverHighlight} onClick={toggleEditMode}>{value}</Typography> :
        <Typography onClick={toggleEditMode} className={classes.label}>{props.label}</Typography>

    if (editMode) {
        if (props.telephone) {
            return (
                <TelephoneTextFieldControlled
                    margin="dense"
                    onKeyUp={(ev) => {
                        switch(ev.key) {
                            case "Enter": {
                                setEditMode(false);
                                ev.preventDefault();
                                break;
                            }
                            case "Escape": {
                                setValue(firstValue.current);
                                props.onChange({target: {value: firstValue.current}});
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
                    onBlur={toggleEditMode}
                    value={value}
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
                                setEditMode(false);
                                ev.preventDefault();
                                break;
                            }
                            case "Escape": {
                                setValue(firstValue.current);
                                props.onChange({target: {value: firstValue.current}});
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
                    onBlur={toggleEditMode}
                    value={value}
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
    telephone: PropTypes.bool

}

ClickableTextField.defaultProps = {
    value: "",
    disabled: false,
    label: "Click to edit",
    onChange: () => {},
    telephone: false
}

export default ClickableTextField;
