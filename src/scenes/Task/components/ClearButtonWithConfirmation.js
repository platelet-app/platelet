import React, {useState} from "react";
import {Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types";

const useStyles = makeStyles({
    button: {
        height: 9,
    },
})

function ClearButtonWithConfirmation(props) {
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    function onClick() {
        setOpen(true);
    }

    function onSelect(result) {
        if (result)
            props.onClear();
        setOpen(false)
    }

    return (
        <>
            <ConfirmationDialog onSelect={onSelect} dialogTitle={"Are you sure?"}
                                dialogText={`Are you sure you want to clear the ${props.label.toLowerCase()} location?`}
                                open={open}/>
            <Tooltip title={"Clear"}>
                <IconButton
                    className={classes.button}
                    edge={"end"}
                    disabled={props.disabled}
                    onClick={onClick}>
                    <CancelIcon/>
                </IconButton>
            </Tooltip>
        </>
    )

}

ClearButtonWithConfirmation.propTypes = {
    disabled: PropTypes.bool,
    onClear: PropTypes.func,
    label: PropTypes.string
}

ClearButtonWithConfirmation.defaultProps = {
    disabled: false,
    onClear: () => {
    },
    label: ""
}

export default ClearButtonWithConfirmation;
