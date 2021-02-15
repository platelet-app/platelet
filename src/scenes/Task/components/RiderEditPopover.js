import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import React from "react";
import {Popover} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TaskAssignees from "./TaskAssignees";

function RiderEditPopover(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div className={props.className}>
            <IconButton style={{height: 6}} onClick={handleClick}>
                <EditIcon/>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <TaskAssignees assignees={props.assignees} onRemove={handleClose} taskUUID={props.taskUUID}/>
            </Popover>
        </div>
    );
}

export default RiderEditPopover;
