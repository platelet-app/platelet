import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
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
import {showHide} from "../../../styles/common";
import Grid from "@material-ui/core/Grid";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

function AssignRiderCoordinatorPopover(props) {
    const dispatch = useDispatch();
    const {show, hide} = showHide();
    const [open, setOpen] = React.useState(false);
    const onSelect = user => {
        if (user) {
            if (props.role === "rider")
                dispatch(addTaskAssignedRiderRequest(props.taskUUID, user.uuid, user.patch_id))
            else if (props.role === "coordinator")
                dispatch(addTaskAssignedCoordinatorRequest(props.taskUUID, user.uuid))
        }
        handleClose();
    }

    function handleOpen() {
        setOpen(true);

    }

    function handleClose() {
        setOpen(false);

    }


    const buttons =
        !open ? <SmallCirclePlusButton tooltip={`Assign a ${props.role}`} onClick={handleOpen}/> :
        <IconButton onClick={handleClose}>
            <CloseIcon/>
        </IconButton>

    if (props.role === "coordinator") {
        return (
            <Grid container direction={"row"} spacing={2} justify={"flex-start"} alignItems={"center"}>
                <Grid item>
                    {buttons}
                </Grid>
                <Grid item>
                        <CoordinatorPicker size={"small"}
                                           className={open ? show : hide}
                                           exclude={props.exclude}
                                           onSelect={onSelect}
                                           label={"Select coordinator"}/>
                </Grid>
            </Grid>
        );
    } else if (props.role === "rider") {
        return (
            <Grid container direction={"row"} spacing={2} justify={"flex-end"} alignItems={"center"}>
                <Grid item>
                    <RiderPicker className={open ? show : hide}
                                 exclude={props.exclude}
                                 onSelect={onSelect}
                                 size={"small"}
                                 label={"Select rider"}/>
                </Grid>
                <Grid item>
                    {buttons}
                </Grid>
            </Grid>
        );
    }
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
