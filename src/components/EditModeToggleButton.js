import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";

function EditModeToggleButton(props) {
    return props.value ? (
        <Tooltip title={props.tooltipEdit}>
            <IconButton
                color="secondary"
                aria-label="Finish"
                onClick={() => props.onChange(false)}
            >
                <EditIcon />
            </IconButton>
        </Tooltip>
    ) : (
        <Tooltip title={props.tooltipDefault}>
            <IconButton
                className={props.className}
                aria-label={props["aria-label"]}
                onClick={() => props.onChange(true)}
            >
                <EditIcon />
            </IconButton>
        </Tooltip>
    );
}

EditModeToggleButton.propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func,
    tooltipDefault: PropTypes.string,
    tooltipEdit: PropTypes.string,
    className: PropTypes.string,
    "aria-label": PropTypes.string,
};

EditModeToggleButton.defaultProps = {
    value: false,
    onChange: () => {},
    tooltipDefault: "Edit",
    tooltipEdit: "Finish",
    className: "",
    "aria-label": "Edit",
};

export default EditModeToggleButton;
