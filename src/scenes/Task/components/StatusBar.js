import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { AppBar, Hidden } from "@material-ui/core";
import { ArrowButton } from "../../../components/Buttons";
import { showHide } from "../../../styles/common";
import { encodeUUID, taskStatusHumanReadable } from "../../../utilities";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import { useSelector } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";

const colourBarPercent = "90%";

const generateClass = (theme, status) => {
    if (status) {
        return {
            padding: 2,
            display: "flex",
            width: "100%",
            paddingLeft: 15,
            paddingRight: 15,
            italic: {
                fontStyle: "italic",
            },
            background: `linear-gradient(0deg,
        ${theme.palette.background.paper}
        ${colourBarPercent},
        ${theme.palette.background.paper}
        ${colourBarPercent},
        ${theme.palette.taskStatus[status]}
        ${colourBarPercent},
        ${theme.palette.taskStatus[status]} 100%)`,
        };
    } else {
        return {
            padding: 2,
            display: "flex",
            width: "100%",
            paddingLeft: 15,
            paddingRight: 15,
            italic: {
                fontStyle: "italic",
            },
            background:
                theme.palette.type === "dark"
                    ? theme.palette.background.paper
                    : theme.palette.primary.main,
        };
    }
};

const dialogComponent = (props) =>
    makeStyles((theme) => {
        return {
            root: generateClass(theme, props.status),
            text: {
                color: theme.palette.type === "dark" ? "white" : "black",
            },
            items: {
                marginTop: 5,
            },
        };
    });

function StatusBar(props) {
    const classes = dialogComponent(props)();
    const { show, hide } = showHide();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const task = useSelector((state) => state.task.task);
    const roleView = useSelector((state) => state.roleView);
    const statusHumanReadable = taskStatusHumanReadable(props.status);
    // don't change container to container item, it breaks the layout for some reason
    return (
        <AppBar
            position={isSm ? "relative" : "sticky"}
            className={classes.root}
        >
            <Grid
                className={classes.items}
                container
                direction={"row"}
                justify={"space-between"}
                alignItems={"center"}
            >
                <Grid item>
                    <Hidden smDown>
                        <Button onClick={props.handleClose}>Close</Button>
                    </Hidden>
                    <Hidden smUp>
                        <IconButton size={"small"} onClick={props.handleClose}>
                            <ArrowButton size={3} direction={"back"} />
                        </IconButton>
                    </Hidden>
                </Grid>
                <Grid item>
                    <Grid
                        container
                        direction={"row"}
                        alignItems={"center"}
                        justify={"flex-start"}
                        spacing={2}
                    >
                        <Grid item>
                            <Grid container spacing={1} direction={"row"}>
                                <Grid item>
                                    <Typography
                                        className={clsx(
                                            classes.italic,
                                            classes.text
                                        )}
                                    >
                                        Status:
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography className={classes.text}>
                                        {statusHumanReadable}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid
                        container
                        direction={"row"}
                        alignItems={"center"}
                        justify={"flex-start"}
                        spacing={2}
                    >
                        <Hidden smDown>
                            <Grid item>
                                <ArrowButton
                                    linkTo={encodeUUID(
                                        task.relay_previous_uuid
                                    )}
                                    direction={"back"}
                                    size={3}
                                    tooltip={"Previous relay"}
                                    className={
                                        !!task.relay_previous_uuid &&
                                        roleView !== "rider"
                                            ? show
                                            : hide
                                    }
                                />
                            </Grid>
                            <Grid item>
                                <ArrowButton
                                    linkTo={encodeUUID(
                                        task.relay_next
                                            ? task.relay_next.uuid
                                            : null
                                    )}
                                    direction={"forward"}
                                    size={3}
                                    tooltip={"Next relay"}
                                    className={
                                        !!task.relay_next &&
                                        roleView !== "rider"
                                            ? show
                                            : hide
                                    }
                                />
                            </Grid>
                        </Hidden>
                    </Grid>
                </Grid>
                <Grid item>
                    <TaskContextMenu
                        timeDroppedOff={task.time_dropped_off}
                        timePickedUp={task.time_picked_up}
                        assignedRiders={task.assigned_riders}
                        disableDeleted={true}
                        disableRelay={true}
                        taskUUID={task.uuid}
                        timeCancelled={task.time_cancelled}
                        timeRejected={task.time_rejected}
                    />
                </Grid>
            </Grid>
        </AppBar>
    );
}

StatusBar.propTypes = {
    assignedCoordinators: PropTypes.array,
    assignedRiders: PropTypes.array,
    handleClose: PropTypes.func,
    status: PropTypes.string,
    relayNext: PropTypes.string,
    relayPrevious: PropTypes.string,
    taskUUID: PropTypes.string.isRequired,
};

StatusBar.defaultProps = {
    assignedCoordinators: [],
    assignedRiders: [],
    status: null,
};

export default StatusBar;
