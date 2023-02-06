import React from "react";
import RiderPicker from "../../../components/RiderPicker";
import PropTypes from "prop-types";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import { showHide } from "../../../styles/common";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { AddCircleOutline } from "@mui/icons-material";
import { userRoles } from "../../../apiConsts";

const useStyles = makeStyles()((theme, { iconColor }) => ({
    button: {
        color: iconColor,
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
}));

function AssignRiderCoordinatorPopover(props) {
    const { show, hide } = showHide().classes;
    const [open, setOpen] = React.useState(false);
    const { classes, cx } = useStyles({ iconColor: props.iconColor });
    const onSelect = (user) => {
        props.onSelect(
            user,
            props.rider ? userRoles.rider : userRoles.coordinator
        );
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
                size="large"
            >
                <AddCircleOutline className={classes.button} />
            </IconButton>
        </Tooltip>
    ) : (
        <IconButton onClick={handleClose} size="large">
            <CloseIcon className={classes.button} />
        </IconButton>
    );

    if (props.coordinator) {
        return (
            <Grid
                container
                direction={"row"}
                spacing={2}
                justifyContent={"flex-end"}
                alignItems={"center"}
            >
                <Grid item>
                    <CoordinatorPicker
                        size={"small"}
                        className={cx(open ? show : hide, classes.button)}
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
                justifyContent={"flex-end"}
                alignItems={"center"}
            >
                <Grid item>
                    <RiderPicker
                        className={cx(open ? show : hide, classes.button)}
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
    onSelect: PropTypes.func,
    taskUUID: PropTypes.string,
    exclude: PropTypes.arrayOf(PropTypes.string),
    coordinator: PropTypes.bool,
    rider: PropTypes.bool,
};

AssignRiderCoordinatorPopover.defaultProps = {
    iconColor: "primary",
    onSelect: () => {},
    exclude: [],
};

export default AssignRiderCoordinatorPopover;
