import React from 'react';
import '../../../App.css';
import 'typeface-roboto'
import CardContent from '@material-ui/core/CardContent';
import Moment from "react-moment";
import Grid from "@material-ui/core/Grid";
import CardItem from "../../../components/CardItem"
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import UserAvatar from "../../../components/UserAvatar";
import {Tooltip} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";
import {StyledCard} from "../../../styles/common";

const colourBarPercent = "90%"

const useStyles = makeStyles({
    new: {
        background: `linear-gradient(0deg, rgba(250, 250, 250,1) ${colourBarPercent}, rgba(255,255,255,1) 90%, rgba(252, 231, 121, 1) 90%, rgba(252, 231, 121, 1) 100%)`,
        cursor: "pointer"
    },
    active: {
        background: `linear-gradient(0deg, rgba(250, 250, 250,1) ${colourBarPercent}, rgba(255,255,255,1) 90%, cornflowerblue 90%, cornflowerblue 100%)`,
        cursor: "pointer"
    },
    pickedUp: {
        background: `linear-gradient(0deg, rgba(250, 250, 250,1) ${colourBarPercent}, rgba(255,255,255,1) 90%, orange 90%, orange 100%)`,
        cursor: "pointer"
    },
    delivered: {
        background: `linear-gradient(0deg, rgba(250, 250, 250,1) ${colourBarPercent}, rgba(255,255,255,1) 90%, lightgreen 90%, lightgreen 100%)`,
        cursor: "pointer"
    }
})

const TaskCard = React.memo((props) => {
    const whoami = useSelector(state => state.whoami.user);
    // TODO: if the users change every card will be rerendered. Try and fix etag with profile picture urls on the backend
    const users = useSelector(state => state.users.users);
    const classes = useStyles();
    const roleView = useSelector(state => state.roleView);
    let pickupTitle = "";
    if (props.pickupAddress) {
        pickupTitle = props.pickupAddress.line1 ? props.pickupAddress.line1 : "";
    }
    let pickupWard = "";
    if (props.pickupAddress) {
        pickupWard = props.pickupAddress.ward ? props.pickupAddress.ward : "";
    }
    let dropoffTitle = "";
    if (props.dropoffAddress) {
        dropoffTitle = (props.dropoffAddress.line1) ? props.dropoffAddress.line1 : "";
    }
    let dropoffWard = "";
    if (props.dropoffAddress) {
        dropoffWard = props.dropoffAddress.ward ? props.dropoffAddress.ward : ""
    }
    const hasRider = props.assignedRiders ? !!props.assignedRiders.length : false;
    const patch = props.patch ? props.patch : "";

    let className;

    if (!hasRider) {
        className = classes.new
    } else if (hasRider && !props.timePickedUp) {
        className = classes.active
    } else if (hasRider && props.timePickedUp && !props.timeDroppedOff) {
        className = classes.pickedUp

    } else if (props.timeDroppedOff) {
        className = classes.delivered
    }

    const coordAvatars = props.assignedCoordinators ? roleView === "coordinator" ? props.assignedCoordinators.filter(u => u.uuid !== whoami.uuid) : props.assignedCoordinators : [];
    const riderAvatars = props.assignedRiders ? roleView === "rider" ? props.assignedRiders.filter(u => u.uuid !== whoami.uuid) : props.assignedRiders : [];
    const cardInnerContent =
            <CardContent style={{paddingTop: "5px"}}>
                <Grid container spacing={0} alignItems={"flex-start"} justify={"flex-start"} direction={"column"}>
                    <Grid item>
                        <Grid container style={{width: "320px", height:"30px", paddingBottom: "10px"}} direction={"row"}
                              justify={"space-between"} alignItems={"center"}>
                            <Grid item>
                                <Tooltip title={props.assignedCoordinatorsDisplayString}>
                                    <AvatarGroup>
                                        {coordAvatars.map((u) =>
                                         <UserAvatar key={u.uuid} size={3} userUUID={u.uuid}
                                                        displayName={u.display_name}
                                                        avatarURL={u.profile_picture_thumbnail_url}/>
                                        )
                                        }
                                    </AvatarGroup>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title={props.assignedRidersDisplayString}>
                                    <AvatarGroup>
                                        {riderAvatars.map((u) =>
                                            <UserAvatar key={u.uuid} size={3} userUUID={u.uuid}
                                                        displayName={u.display_name}
                                                        avatarURL={u.profile_picture_thumbnail_url}/>
                                        )
                                        }
                                    </AvatarGroup>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>

                    <CardItem label={"Patch"}>{patch}</CardItem>
                    <CardItem label={"From"}>{pickupTitle}</CardItem>
                    <CardItem label={"Ward"}>{pickupWard}</CardItem>
                    <CardItem label={"To"}>{dropoffTitle}</CardItem>
                    <CardItem label={"Ward"}>{dropoffWard}</CardItem>
                    <CardItem label={"TOC"}><Moment local calendar>{props.timeOfCall}</Moment></CardItem>
                    <CardItem label={"Priority"}>{props.priority}</CardItem>
                </Grid>
            </CardContent>

        return (
            <StyledCard className={className}>
                {cardInnerContent}
            </StyledCard>
        )
})

export default TaskCard;
