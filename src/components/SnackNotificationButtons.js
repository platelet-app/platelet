import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { DismissButton } from "../styles/common";

function SnackNotificationButtons(props) {
    const [showUndo, setShowUndo] = useState(!!props.restoreCallback);
    const { restoreCallback, viewLink, snackKey, closeSnackbar } = props;
    useEffect(() => {
        setTimeout(() => setShowUndo(false), 4000);
    }, []);
    return (
        <React.Fragment>
            {showUndo && (
                <Button
                    color="secondary"
                    size="small"
                    onClick={() => {
                        props.closeSnackbar(snackKey);
                        restoreCallback();
                    }}
                >
                    UNDO
                </Button>
            )}
            {viewLink && (
                <Button
                    color="secondary"
                    size="small"
                    component={Link}
                    to={viewLink || "/"}
                >
                    VIEW
                </Button>
            )}
            {closeSnackbar ? (
                <DismissButton onClick={() => closeSnackbar(snackKey)} />
            ) : (
                <></>
            )}
        </React.Fragment>
    );
}

SnackNotificationButtons.propTypes = {
    restoreCallback: PropTypes.func,
    closeSnackbar: PropTypes.func,
    viewLink: PropTypes.string,
    snackKey: PropTypes.number,
};

SnackNotificationButtons.defaultProps = {
    snackKey: 0,
};

export default SnackNotificationButtons;
