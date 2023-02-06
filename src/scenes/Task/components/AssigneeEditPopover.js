import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { Popover } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import TaskAssignees from "./TaskAssignees";
import PropTypes from "prop-types";
import { showHide } from "../../../styles/common";

function AssigneeEditPopover(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { show, hide } = showHide().classes;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const useStyles = makeStyles()({
        button: {
            color: props.iconColor,
        },
    });
    const { classes, cx } = useStyles();

    return (
        <>
            <IconButton onClick={handleClick} size="large">
                <EditIcon
                    className={cx(
                        classes.button,
                        props.assignees.length === 0 ? hide : show
                    )}
                />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <TaskAssignees {...props} onRemove={handleClose} />
            </Popover>
        </>
    );
}

AssigneeEditPopover.propTypes = {
    iconColor: PropTypes.string,
    taskUUID: PropTypes.string.isRequired,
    assignees: PropTypes.arrayOf(PropTypes.object),
    rider: PropTypes.bool,
    coordinator: PropTypes.bool,
};

AssigneeEditPopover.defaultProps = {
    iconColor: "primary",
    assignees: [],
    rider: false,
    coordinator: false,
};

export default AssigneeEditPopover;
