import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { Popover, makeStyles } from "@material-ui/core";
import TaskAssignees from "./TaskAssignees";
import PropTypes from "prop-types";
import { showHide } from "../../../styles/common";
import clsx from "clsx";

function AssigneeEditPopover(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { show, hide } = showHide();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const useStyles = makeStyles({
        button: {
            color: props.iconColor,
        },
    });
    const classes = useStyles();

    return (
        <>
            <IconButton onClick={handleClick}>
                <EditIcon
                    className={clsx(
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
