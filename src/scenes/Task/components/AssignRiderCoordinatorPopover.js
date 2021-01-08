import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import RiderPicker from "../../../components/RiderPicker";
import {SmallCirclePlusButton} from "../../../components/Buttons";
import {useDispatch} from "react-redux";
import {
    addTaskAssignedCoordinatorRequest,
    addTaskAssignedRiderRequest
} from "../../../redux/taskAssignees/TaskAssigneesActions";
import PropTypes from "prop-types";
import CoordinatorPicker from "../../../components/CoordinatorPicker";

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
    popover: {
        padding: "10px"
    }
}));

function AssignRiderCoordinatorPopover(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const onSelect = user => {
        if (props.role === "rider")
            dispatch(addTaskAssignedRiderRequest(props.taskUUID, user.uuid, user.patch_id))
        else if (props.role === "coordinator")
            dispatch(addTaskAssignedCoordinatorRequest(props.taskUUID, user.uuid))
        handleClose();
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'assign-rider-popover' : undefined;

    return (
        <div>
            <SmallCirclePlusButton tooltip={`Assign a ${props.role}`} onClick={handleClick} colour={"black"}/>
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
                <div className={classes.popover}>
                    {props.role === "coordinator" ?
                        <CoordinatorPicker exclude={props.exclude} onSelect={onSelect} label={"Select coordinator"}/>
                        : <RiderPicker exclude={props.exclude} onSelect={onSelect} label={"Select rider"}/>
                    }
                </div>
            </Popover>
        </div>
    );
}

AssignRiderCoordinatorPopover.propTypes = {
    taskUUID: PropTypes.string,
    role: PropTypes.oneOf(["coordinator", "rider"]),
    exclude: PropTypes.arrayOf(PropTypes.string)
}

AssignRiderCoordinatorPopover.defaultProps = {
    exclude: []
}

export default AssignRiderCoordinatorPopover;
