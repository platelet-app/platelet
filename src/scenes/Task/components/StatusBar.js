import React from "react";
import {AvatarGroup} from "@material-ui/lab";
import UserAvatar from "../../../components/UserAvatar";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import {dialogComponent} from "../styles/TaskDialogCSS"
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {Tooltip} from "@material-ui/core";
import {ArrowButton, SmallCirclePlusButton} from "../../../components/Buttons";
import {showHide} from "../../../styles/common";
import {encodeUUID} from "../../../utilities";
import RiderPicker from "../../../components/RiderPicker";
import AssignRiderPopover from "./AssignRiderPopover";


function StatusBar(props) {
    const classes = dialogComponent();
    const {show, hide} = showHide();
    return (
        <div className={classes.statusBar}>
            <Grid container direction={"row"} justify={"space-between"}>
                <Grid item>
                    <Grid container direction={"row"} alignItems={"center"} justify={"flex-start"} spacing={2}>
                        <Grid item>
                            <Tooltip title={props.assignedCoordinatorsDisplayString}>
                                <AvatarGroup>
                                    {props.assignedCoordinators.map((u) =>
                                        <UserAvatar
                                            size={5}
                                            userUUID={u.uuid}
                                            displayName={u.display_name}
                                            avatarURL={u.avatar_url}/>)
                                    }
                                </AvatarGroup>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <SmallCirclePlusButton tooltip={"Assign a coordinator"} colour={"black"}/>
                        </Grid>
                        <Grid item>
                            <Typography>Status: {props.status}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container direction={"row"} alignItems={"center"} justify={"flex-start"} spacing={2}>
                        <Grid item>
                            <Tooltip title={props.assignedRidersDisplayString}>
                                <AvatarGroup>
                                    {props.assignedRiders.map((u) =>
                                        <UserAvatar
                                            size={5}
                                            userUUID={u.uuid}
                                            displayName={u.display_name}
                                            avatarURL={u.avatar_url}/>)
                                    }
                                </AvatarGroup>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <AssignRiderPopover/>
                        </Grid>
                        <Grid item>
                            <ArrowButton linkTo={encodeUUID(props.relayPrevious)} direction={"back"} tooltip={"Previous relay"} className={props.relayPrevious ? show : hide}/>
                        </Grid>
                        <Grid item>
                            <ArrowButton linkTo={encodeUUID(props.relayNext)} direction={"forward"} tooltip={"Next relay"} className={props.relayNext ? show : hide}/>
                        </Grid>
                        <Grid item>
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
    relayPrevious: PropTypes.string
}

StatusBar.defaultProps = {
    assignedCoordinators: [],
    assignedRiders: [],
    status: "No Status"
}

export default StatusBar;
