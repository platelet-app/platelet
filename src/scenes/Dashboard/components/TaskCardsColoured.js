import React from "react";
import PropTypes from "prop-types";
import "../../../App.css";
import CardContent from "@mui/material/CardContent";
import Moment from "react-moment";
import Grid from "@mui/material/Grid";
import CardItem from "../../../components/CardItem";
import AvatarGroup from "@mui/material/AvatarGroup";
import UserAvatar from "../../../components/UserAvatar";
import { Tooltip } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useSelector } from "react-redux";
import { StyledCard } from "../../../styles/common";
import { getWhoami } from "../../../redux/Selectors";

const colourBarPercent = "90%";

const generateClass = (theme, status) => {
    return {
        background: `linear-gradient(0deg,
        rgba(0,0,0,0)
        ${colourBarPercent},
        rgba(0,0,0,0)
        ${colourBarPercent},
        ${theme.palette.taskStatus[status]}
        ${colourBarPercent},
        ${theme.palette.taskStatus[status]} 100%)`,
        cursor: "pointer",
    };
};

const useStyles = makeStyles((theme) => ({
    cardContent: {
        paddingTop: 5,
    },
    NEW: generateClass(theme, "NEW"),
    ACTIVE: generateClass(theme, "ACTIVE"),
    PICKED_UP: generateClass(theme, "PICKED_UP"),
    DROPPED_OFF: generateClass(theme, "DROPPED_OFF"),
    CANCELLED: generateClass(theme, "CANCELLED"),
    REJECTED: generateClass(theme, "REJECTED"),
    itemTopBarContainer: {
        width: "100%",
        height: 30,
        paddingBottom: 10,
    },
    gridItem: {
        width: "100%",
        paddingRight: 20,
    },
    contextDots: {
        zIndex: 100,
        position: "relative",
        bottom: 35,
        left: 20,
    },
}));

const TaskCard = React.memo((props) => {
    const whoami = useSelector(getWhoami);
    const classes = useStyles();
    const roleView = useSelector((state) => state.roleView);
    let pickUpTitle = "";
    if (props.pickUpLocation) {
        pickUpTitle = props.pickUpLocation.line1
            ? props.pickUpLocation.line1
            : "";
    }
    let pickUpWard = "";
    if (props.pickUpLocation) {
        pickUpWard = props.pickUpLocation.ward ? props.pickUpLocation.ward : "";
    }
    let dropOffTitle = "";
    if (props.dropOffLocation) {
        dropOffTitle = props.dropOffLocation.line1
            ? props.dropOffLocation.line1
            : "";
    }
    let dropOffWard = "";
    if (props.dropOffLocation) {
        dropOffWard = props.dropOffLocation.ward
            ? props.dropOffLocation.ward
            : "";
    }
    const hasRider = props.assignedRiders
        ? !!props.assignedRiders.length
        : false;

    const className = classes[props.status];

    const coordAvatars = props.assignedCoordinators
        ? ["coordinator", "all"].includes(roleView)
            ? props.assignedCoordinators.filter((u) => u.id !== whoami.id)
            : props.assignedCoordinators
        : [];
    const riderAvatars = props.assignedRiders
        ? roleView === "rider"
            ? props.assignedRiders.filter((u) => u.id !== whoami.id)
            : props.assignedRiders
        : [];
    const cardInnerContent = (
        <CardContent className={classes.cardContent}>
            <Grid
                container
                spacing={0}
                alignItems={"flex-end"}
                justifyContent={"flex-start"}
                direction={"column"}
            >
                <Grid
                    container
                    item
                    className={classes.itemTopBarContainer}
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Grid item>
                        <Tooltip
                            title={props.assignedCoordinatorsDisplayString}
                        >
                            <AvatarGroup>
                                {coordAvatars.map((u) => (
                                    <UserAvatar
                                        key={u.id}
                                        size={3}
                                        userUUID={u.id}
                                        displayName={u.displayName}
                                        avatarURL={u.profilePictureThumbnailURL}
                                    />
                                ))}
                            </AvatarGroup>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title={props.assignedRidersDisplayString}>
                            <AvatarGroup>
                                {riderAvatars.map((u) => (
                                    <UserAvatar
                                        key={u.id}
                                        size={3}
                                        userUUID={u.id}
                                        displayName={u.displayName}
                                        avatarURL={u.profilePictureThumbnailURL}
                                    />
                                ))}
                            </AvatarGroup>
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"Responsibility"}>
                        {props.riderResponsibility}
                    </CardItem>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"From"}>{pickUpTitle}</CardItem>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"Ward"}>{pickUpWard}</CardItem>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"To"}>{dropOffTitle}</CardItem>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"Ward"}>{dropOffWard}</CardItem>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"TOC"}>
                        <Moment local calendar>
                            {props.timeOfCall}
                        </Moment>
                    </CardItem>
                </Grid>
                <Grid className={classes.gridItem} item>
                    <CardItem label={"Priority"}>{props.priority}</CardItem>
                </Grid>
            </Grid>
        </CardContent>
    );

    return (
        <StyledCard PaperProps={{ elevation: 1 }} className={className}>
            {cardInnerContent}
        </StyledCard>
    );
});

TaskCard.propTypes = {
    pickUpAddress: PropTypes.object,
    dropOffAddress: PropTypes.object,
    assignedRiders: PropTypes.arrayOf(PropTypes.object),
    assignedCoordinators: PropTypes.arrayOf(PropTypes.object),
    riderResponsibility: PropTypes.string,
    timePickedUp: PropTypes.string,
    timeDroppedOff: PropTypes.string,
    assignedCoordinatorsDisplayString: PropTypes.string,
    assignedRidersDisplayString: PropTypes.string,
    timeOfCall: PropTypes.string,
    priority: PropTypes.string,
};

TaskCard.defaultProps = {
    assignedRiders: [],
    assignedCoordinators: [],
    riderResponsibility: "",
    priority: "",
};

export default TaskCard;
