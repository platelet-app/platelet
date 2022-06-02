import React from "react";
import PropTypes from "prop-types";
import "../../../App.css";
import CardContent from "@mui/material/CardContent";
import Moment from "react-moment";
import CardItem from "../../../components/CardItem";
import AvatarGroup from "@mui/material/AvatarGroup";
import UserAvatar from "../../../components/UserAvatar";
import { Divider, Stack, Tooltip, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { StyledCard } from "../../../styles/common";
import Badge from "@mui/material/Badge";
import MessageIcon from "@mui/icons-material/Message";

const colourBarPercent = "90%";

const generateClass = (theme, status) => {
    if (!theme || !status) {
        return {};
    }
    return {
        background: `linear-gradient(0deg,
        rgba(0,0,0,0)
        ${colourBarPercent},
        rgba(0,0,0,0)
        ${colourBarPercent},
        ${theme.palette.taskStatus[status]}
        ${colourBarPercent},
        ${theme.palette.taskStatus[status]} 100%)`,
    };
};

const useStyles = makeStyles((theme) => ({
    cardContent: {
        paddingTop: 5,
        userSelect: "none",
    },
    NEW: generateClass(theme, "NEW"),
    ACTIVE: generateClass(theme, "ACTIVE"),
    PICKED_UP: generateClass(theme, "PICKED_UP"),
    DROPPED_OFF: generateClass(theme, "DROPPED_OFF"),
    COMPLETED: generateClass(theme, "COMPLETED"),
    CANCELLED: generateClass(theme, "CANCELLED"),
    REJECTED: generateClass(theme, "REJECTED"),
    ABANDONED: generateClass(theme, "ABANDONED"),
    itemTopBarContainer: {
        width: "100%",
        height: 30,
        paddingBottom: 10,
    },
    divider: { width: "0%", margin: 4 },
    typography: { fontSize: "14px" },
    badgeCircle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.4)"
                : "rgba(255,255,255,0.5)",
    },
}));

const TaskCard = React.memo((props) => {
    const assigneesDisplayString = props.assignees
        .map((assignee) => assignee.displayName)
        .join(", ");
    const classes = useStyles();
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
    const className = classes[props.status];

    let priorityColor = "inherit";
    if (props.priority === "HIGH") {
        priorityColor = "red";
    } else if (props.priority === "MEDIUM") {
        priorityColor = "orange";
    }

    const cardInnerContent = (
        <CardContent className={classes.cardContent}>
            <Stack
                spacing={0}
                alignItems={"center"}
                justifyContent={"flex-start"}
                direction={"column"}
            >
                <Stack
                    className={classes.itemTopBarContainer}
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    {props.commentCount > 0 ? (
                        <Tooltip
                            title={`${props.commentCount} ${
                                props.commentCount === 1
                                    ? "comment"
                                    : "comments"
                            }`}
                            placement={"top"}
                        >
                            <Badge color={"primary"}>
                                <div className={classes.badgeCircle}>
                                    <MessageIcon />
                                </div>
                            </Badge>
                        </Tooltip>
                    ) : (
                        <div></div>
                    )}
                    <Tooltip title={assigneesDisplayString}>
                        <AvatarGroup>
                            {props.assignees.map((u) => (
                                <UserAvatar
                                    key={u.id}
                                    size={3}
                                    userUUID={u.id}
                                    displayName={u.displayName}
                                    thumbnailKey={
                                        u.profilePictureThumbnail
                                            ? u.profilePictureThumbnail.key
                                            : null
                                    }
                                />
                            ))}
                        </AvatarGroup>
                    </Tooltip>
                </Stack>
                <Stack
                    sx={{ width: "100%" }}
                    spacing={1}
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Stack spacing={1} direction="row" alignItems="center">
                        <Typography className={classes.typography}>
                            Priority:
                        </Typography>
                        <Typography
                            sx={{
                                color: priorityColor,
                                fontStyle: props.priority ? "normal" : "italic",
                                fontWeight: props.priority ? "bold" : "normal",
                            }}
                            className={classes.typography}
                        >
                            {props.priority || "Unset"}
                        </Typography>
                    </Stack>
                    {props.riderResponsibility && (
                        <Stack spacing={1} direction="row" alignItems="center">
                            <Typography
                                sx={{
                                    fontStyle: props.riderResponsibility
                                        ? "normal"
                                        : "italic",
                                    fontWeight: props.riderResponsibility
                                        ? "bold"
                                        : "normal",
                                }}
                                className={classes.typography}
                            >
                                {props.riderResponsibility || "Unset"}
                            </Typography>
                        </Stack>
                    )}
                </Stack>
                <Divider className={classes.divider} />
                <CardItem fullWidth label={"From"}>
                    {pickUpTitle}
                </CardItem>
                <CardItem fullWidth label={"Ward"}>
                    {pickUpWard}
                </CardItem>
                <Divider className={classes.divider} />
                <CardItem fullWidth label={"To"}>
                    {dropOffTitle}
                </CardItem>
                <CardItem fullWidth label={"Ward"}>
                    {dropOffWard}
                </CardItem>
                <Divider className={classes.divider} />
                <CardItem fullWidth label={"TOC"}>
                    <Moment local calendar>
                        {props.timeOfCall}
                    </Moment>
                </CardItem>
            </Stack>
        </CardContent>
    );

    return <StyledCard className={className}>{cardInnerContent}</StyledCard>;
});

TaskCard.propTypes = {
    pickUpLocation: PropTypes.object,
    dropOffLocation: PropTypes.object,
    riderResponsibility: PropTypes.string,
    timeOfCall: PropTypes.string,
    priority: PropTypes.string,
    assignees: PropTypes.arrayOf(PropTypes.object),
};

TaskCard.defaultProps = {
    riderResponsibility: "",
    priority: "",
    assignees: [],
};

export default TaskCard;
