import React from "react";
import RiderPicker from "../../../components/RiderPicker";
import { SmallCirclePlusButton } from "../../../components/Buttons";
import { useDispatch } from "react-redux";
import {
    addTaskAssignedCoordinatorRequest,
    addTaskAssignedRiderRequest,
} from "../../../redux/taskAssignees/TaskAssigneesActions";
import PropTypes from "prop-types";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import { showHide } from "../../../styles/common";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, Tooltip } from "@material-ui/core";
import clsx from "clsx";
import { AddCircleOutline } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
    button: (props) => ({
        color: props.iconColor,
        width: theme.spacing(4),
        height: theme.spacing(4),
    }),
}));

function AssignRiderCoordinatorPopover(props) {
    const dispatch = useDispatch();
    const { show, hide } = showHide();
    const [open, setOpen] = React.useState(false);
    const classes = useStyles(props);
    const onSelect = (user) => {
        if (user) {
            if (props.rider)
                dispatch(
                    addTaskAssignedRiderRequest(
                        props.taskUUID,
                        user.uuid,
                        user.patch_id
                    )
                );
            else if (props.coordinator)
                dispatch(
                    addTaskAssignedCoordinatorRequest(props.taskUUID, user.uuid)
                );
        }
        handleClose();
    };

    function handleOpen() {
        setOpen(true);
    }
    function handleClose() {
        setOpen(false);
    }

    const buttons = !open ? (
        <Tooltip
            title={`Assign a ${props.coordinator ? "coordinator" : "rider"}`}
        >
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpen}
            >
                <AddCircleOutline className={classes.button} />
            </IconButton>
        </Tooltip>
    ) : (
        <IconButton onClick={handleClose}>
            <CloseIcon className={classes.button} />
        </IconButton>
    );

    if (props.coordinator) {
        return (
            <Grid
                container
                direction={"row"}
                spacing={2}
                justify={"flex-end"}
                alignItems={"center"}
            >
                <Grid item>
                    <CoordinatorPicker
                        size={"small"}
                        className={clsx(open ? show : hide, classes.button)}
                        exclude={props.exclude}
                        onSelect={onSelect}
                        label={"Select coordinator"}
                    />
                </Grid>
                <Grid item>{buttons}</Grid>
            </Grid>
        );
    } else if (props.rider) {
        return (
            <Grid
                container
                direction={"row"}
                spacing={2}
                justify={"flex-end"}
                alignItems={"center"}
            >
                <Grid item>
                    <RiderPicker
                        className={clsx(open ? show : hide, classes.button)}
                        exclude={props.exclude}
                        onSelect={onSelect}
                        size={"small"}
                        label={"Select rider"}
                    />
                </Grid>
                <Grid item>{buttons}</Grid>
            </Grid>
        );
    }
}

AssignRiderCoordinatorPopover.propTypes = {
    iconColor: PropTypes.string,
    taskUUID: PropTypes.string,
    exclude: PropTypes.arrayOf(PropTypes.string),
    coordinator: PropTypes.bool,
    rider: PropTypes.bool,
};

AssignRiderCoordinatorPopover.defaultProps = {
    iconColor: "primary",
    exclude: [],
};

export default AssignRiderCoordinatorPopover;
