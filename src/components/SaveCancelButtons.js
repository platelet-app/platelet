import Button from "@mui/material/Button";
import React from "react";
import PropTypes from "prop-types";
import { Stack } from "@mui/material";

function SaveCancelButtons(props) {
    return (
        <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"top"}
            spacing={3}
        >
            <Button disabled={props.disabled} onClick={props.onSave}>
                Save
            </Button>
            <Button disabled={props.disabled} onClick={props.onCancel}>
                Cancel
            </Button>
        </Stack>
    );
}

SaveCancelButtons.propTypes = {
    disabled: PropTypes.bool,
};

SaveCancelButtons.defaultProps = {
    disabled: false,
};

export default SaveCancelButtons;
