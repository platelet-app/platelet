import React, {useRef, useState} from "react";
import {Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types";
import {useHistory, useLocation} from "react-router-dom";

const useStyles = makeStyles({
    button: {
        height: 9,
    },
})

function ClearButtonWithConfirmation(props) {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const firstLocation = useRef(location.pathname);

    history.listen((location, action) => {
        // close the dialog when back button is pressed
        if (action === "POP") {
            if (open) {
                setOpen(false);
            }
        }

    })

    function onClick() {
        setOpen(true);
        // this is to prevent returning to the dashboard when pressing back button
        history.push(`${location.pathname}/#`)
    }

    function onSelect(result) {
        if (result)
            props.onClear();
        setOpen(false)
        history.push(firstLocation.current);
    }

    function handleClose() {
        setOpen(false)
        history.push(firstLocation.current);
    }

    return (
        <>
            <ConfirmationDialog onSelect={onSelect} dialogTitle={"Are you sure?"}
                                onClose={handleClose}
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
