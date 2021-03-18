import React from 'react';
import PropTypes from "prop-types";
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
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";

const colourBarPercent = "90%"

const useStyles = makeStyles(theme => (
    {
        cardContent: {
            paddingTop: 5,
        },
        new: {
            background: `linear-gradient(0deg, ${theme.palette.background.paper} ${colourBarPercent}, ${theme.palette.background.paper} 90%, rgba(252, 231, 121, 1) 90%, rgba(252, 231, 121, 1) 100%)`,
            cursor: "pointer"
        },
        active: {
            background: `linear-gradient(0deg, ${theme.palette.background.paper} ${colourBarPercent}, ${theme.palette.background.paper} 90%, cornflowerblue 90%, cornflowerblue 100%)`,
            cursor: "pointer"
        },
        pickedUp: {
            background: `linear-gradient(0deg, ${theme.palette.background.paper} ${colourBarPercent}, ${theme.palette.background.paper} 90%, orange 90%, orange 100%)`,
            cursor: "pointer"
        },
        delivered: {
            background: `linear-gradient(0deg, ${theme.palette.background.paper} ${colourBarPercent}, ${theme.palette.background.paper} 90%, lightgreen 90%, lightgreen 100%)`,
            cursor: "pointer"
        },
        itemTopBarContainer: {
            width: "100%",
            height: 30,
            paddingBottom: 10
        },
        gridItem: {
            width: "100%",
            paddingRight: 20
        },
        contextDots: {
            zIndex: 100,
            position: "relative",
            bottom: 35,
            left: 20
        }
    }))

const TaskCard = React.memo((props) => {
    const whoami = useSelector(state => state.whoami.user);
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
        <CardContent className={classes.cardContent}>
            <Grid container spacing={0} alignItems={"flex-end"} justify={"flex-start"}
                  direction={"column"}>
                <Grid container item className={classes.itemTopBarContainer}
                      direction={"row"}
                      justify={"space-between"}
                      alignItems={"center"}>
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
                <Grid className={classes.gridItem} item>
                    <CardItem label={"Patch"}>{props.patch}</CardItem>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"From"}>{pickupTitle}</CardItem>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"Ward"}>{pickupWard}</CardItem>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"To"}>{dropoffTitle}</CardItem>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"Ward"}>{dropoffWard}</CardItem>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"TOC"}><Moment local calendar>{props.timeOfCall}</Moment></CardItem>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"Priority"}>{props.priority}</CardItem>
                </Grid>
            </Grid>
        </CardContent>

    return (
        <StyledCard className={className}>
            {cardInnerContent}
        </StyledCard>
    )
})

TaskCard.propTypes = {
    pickupAddress: PropTypes.object,
    dropoffAddress: PropTypes.object,
    assignedRiders: PropTypes.arrayOf(PropTypes.object),
    assignedCoordinators: PropTypes.arrayOf(PropTypes.object),
    timePickedUp: PropTypes.string,
    timeDroppedOff: PropTypes.string,
    assignedCoordinatorsDisplayString: PropTypes.string,
    assignedRidersDisplayString: PropTypes.string,
    timeOfCall: PropTypes.string,
    priority: PropTypes.string
}

TaskCard.defaultProps = {
    assignedRiders: [],
    assignedCoordinators: [],
    patch: "",
    priority: "",


}

export default TaskCard;
