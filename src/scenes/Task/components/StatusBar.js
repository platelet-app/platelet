import React from "react";
import {AvatarGroup} from "@material-ui/lab";
import UserAvatar from "../../../components/UserAvatar";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {AppBar, Hidden, Tooltip} from "@material-ui/core";
import {ArrowButton} from "../../../components/Buttons";
import {showHide} from "../../../styles/common";
import {encodeUUID} from "../../../utilities";
import AssignRiderCoordinatorPopover from "./AssignRiderCoordinatorPopover";
import RiderEditPopover from "./RiderEditPopover";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import {useSelector} from "react-redux";

export const dialogComponent = makeStyles(theme => ({
    fullWidth: {
        display: "flex",
        width: "100%",
        paddingLeft: "15px",
        paddingRight: "15px",
    },
    statusBar: {
        padding: "10px",
        display: "flex",
        width: "100%",
        paddingLeft: "15px",
        paddingRight: "15px",
        background: theme.palette.background.paper
    }
}));

function StatusBar(props) {
    const classes = dialogComponent();
    const {show, hide} = showHide();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const task = useSelector(state => state.task.task);
    // don't change container to container item, it breaks the layout for some reason
    return (
        <AppBar position={isSm ? "relative" : "sticky"} className={classes.statusBar}>
            <Grid container direction={"row"} justify={"space-between"}>

                <Grid item>
                    <Grid container direction={"row"} alignItems={"center"} justify={"flex-start"} spacing={2}>
                        <Hidden smDown>
                            <Grid item>
                                <Tooltip title={task.assigned_coordinators_display_string}>
                                    <AvatarGroup>
                                        {task.assigned_coordinators.map((u) =>
                                            <UserAvatar
                                                key={u.uuid}
                                                size={5}
                                                userUUID={u.uuid}
                                                displayName={u.display_name}
                                                avatarURL={u.profile_picture_thumbnail_url}/>)
                                        }
                                    </AvatarGroup>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <AssignRiderCoordinatorPopover
                                    exclude={task.assigned_coordinators.map(u => u.uuid)}
                                    role={"coordinator"}
                                    taskUUID={props.taskUUID}/>
                            </Grid>
                        </Hidden>
                        <Grid item>
                            <Typography>Status: {props.status}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container direction={"row"} alignItems={"center"} justify={"center"} spacing={2}>
                        <Hidden smDown>
                            <Grid item>
                                <RiderEditPopover assignees={task.assigned_riders}
                                                  className={task.assigned_riders.length > 0 ? show : hide}
                                                  taskUUID={task.uuid}/>
                            </Grid>
                            <Grid item>
                                <Tooltip title={task.assigned_riders_display_string}>
                                    <AvatarGroup>
                                        {task.assigned_riders.map((u) =>
                                            <UserAvatar
                                                key={u.uuid}
                                                size={5}
                                                userUUID={u.uuid}
                                                displayName={u.display_name}
                                                avatarURL={u.profile_picture_thumbnail_url}/>)
                                        }
                                    </AvatarGroup>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <AssignRiderCoordinatorPopover exclude={task.assigned_riders.map(u => u.uuid)}
                                                               role={"rider"} taskUUID={props.taskUUID}/>
                            </Grid>
                        </Hidden>
                        <Hidden smDown>
                            <Grid item>
                                <ArrowButton linkTo={encodeUUID(task.relay_previous_uuid)} direction={"back"}
                                             tooltip={"Previous relay"} className={!!task.relay_previous_uuid ? show : hide}/>
                            </Grid>
                            <Grid item>
                                <ArrowButton linkTo={encodeUUID(task.relay_next)} direction={"forward"}
                                             tooltip={"Next relay"} className={!!task.relay_next ? show : hide}/>
                            </Grid>
                        </Hidden>
                        <Grid item>
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
                            <Button onClick={props.handleClose}>
                                Close
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AppBar>
    )
}

StatusBar.propTypes = {
    assignedCoordinators: PropTypes.array,
    assignedRiders: PropTypes.array,
    handleClose: PropTypes.func,
    status: PropTypes.string,
    relayNext: PropTypes.string,
    relayPrevious: PropTypes.string,
    taskUUID: PropTypes.string
}

StatusBar.defaultProps = {
    assignedCoordinators: [],
    assignedRiders: [],
    status: "No Status"
}

export default StatusBar;
