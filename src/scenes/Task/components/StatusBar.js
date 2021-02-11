import React from "react";
import {AvatarGroup} from "@material-ui/lab";
import UserAvatar from "../../../components/UserAvatar";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import {dialogComponent} from "../styles/TaskDialogCSS"
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {Tooltip} from "@material-ui/core";
import {ArrowButton} from "../../../components/Buttons";
import {showHide} from "../../../styles/common";
import {encodeUUID} from "../../../utilities";
import AssignRiderCoordinatorPopover from "./AssignRiderCoordinatorPopover";


function StatusBar(props) {
    const classes = dialogComponent();
    const {show, hide} = showHide();
    return (
        <div key={"statusbar"} className={classes.statusBar}>
            <Grid container key={"grid"} direction={"row"} justify={"space-between"}>
                <Grid item key={1}>
                    <Grid container direction={"row"} alignItems={"center"} justify={"flex-start"} spacing={2}>
                        <Grid item key={"coords"}>
                            <Tooltip title={props.assignedCoordinatorsDisplayString}>
                                <AvatarGroup>
                                    {props.assignedCoordinators.map((u) =>
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
                        <Grid item key={"coordsPicker"}>
                            <AssignRiderCoordinatorPopover exclude={props.assignedCoordinators.map(u => u.uuid)} role={"coordinator"} taskUUID={props.taskUUID}/>
                        </Grid>
                        <Grid item key={"status"}>
                            <Typography>Status: {props.status}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item key={2}>
                    <Grid container direction={"row"} alignItems={"center"} justify={"flex-start"} spacing={2}>
                        <Grid item key={"riders"}>
                            <Tooltip title={props.assignedRidersDisplayString}>
                                <AvatarGroup>
                                    {props.assignedRiders.map((u) =>
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
                        <Grid item key={"ridersPicker"}>
                            <AssignRiderCoordinatorPopover exclude={props.assignedRiders.map(u => u.uuid)} role={"rider"} taskUUID={props.taskUUID}/>
                        </Grid>
                        <Grid item key={"prev"}>
                            <ArrowButton linkTo={encodeUUID(props.relayPrevious)} direction={"back"} tooltip={"Previous relay"} className={props.relayPrevious ? show : hide}/>
                        </Grid>
                        <Grid item key={"next"}>
                            <ArrowButton linkTo={encodeUUID(props.relayNext)} direction={"forward"} tooltip={"Next relay"} className={props.relayNext ? show : hide}/>
                        </Grid>
                        <Grid item key={"close"}>
                            <Button onClick={props.handleClose}
                                    color="primary">
                                Close
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
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
