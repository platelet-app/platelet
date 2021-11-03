import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import makeStyles from "@mui/styles/makeStyles";
import PropTypes from "prop-types";

const useStyles = makeStyles({
    button: {
        height: 9,
    },
});

function ClearButtonWithConfirmation(props) {
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener("popstate", onBackButtonEvent);
        return () => window.removeEventListener("popstate", onBackButtonEvent);
    }, []);

    const onBackButtonEvent = (event) => {
        event.preventDefault();
        setOpen(false);
    };

    function onClick() {
        setOpen(true);
    }

    function onSelect(result) {
        if (result) props.onClear();
        setOpen(false);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <>
            <ConfirmationDialog
                onSelect={onSelect}
                dialogTitle={"Are you sure?"}
                onClose={handleClose}
                dialogText={`Are you sure you want to clear the ${props.label.toLowerCase()} location?`}
                open={open}
            />
            <Tooltip title={"Clear"}>
                <IconButton
                    className={classes.button}
                    edge={"end"}
                    disabled={props.disabled}
                    onClick={onClick}
                    size="large"
                >
                    <CancelIcon />
                </IconButton>
            </Tooltip>
        </>
    );
}

ClearButtonWithConfirmation.propTypes = {
    disabled: PropTypes.bool,
    onClear: PropTypes.func,
    label: PropTypes.string,
};

ClearButtonWithConfirmation.defaultProps = {
    disabled: false,
    onClear: () => {},
    label: "",
};

export default ClearButtonWithConfirmation;
