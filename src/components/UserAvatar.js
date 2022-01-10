import React from "react";
import Avatar from "@mui/material/Avatar";
import seedrandom from "seedrandom";
import makeStyles from "@mui/styles/makeStyles";
import PropTypes from "prop-types";

const ctx = document.createElement("canvas").getContext("2d");

const colorToHex = (color) => {
    ctx.fillStyle = color;
    return ctx.fillStyle;
};

const PHI = 1.618033988749895;

const generateColorFromString = (str) =>
    colorToHex(
        `hsl(${Math.floor(
            ((seedrandom(str)() + 1 / PHI) % 1) * 360
        )}, 50%, 50%)`
    );

const UserAvatar = React.memo((props) => {
    const nameArray = props.displayName
        ? props.displayName.split(" ")
        : ["n", "a"];
    const reducer = (accumulator, currentValue) =>
        accumulator + currentValue[0];
    const initials = nameArray.reduce(reducer, "").slice(0, 2);
    const avatarFallbackColor = generateColorFromString(props.userUUID);

    const useStyles = makeStyles((theme) => ({
        card: {
            color: theme.palette.getContrastText(avatarFallbackColor),
            backgroundColor: avatarFallbackColor,
            width: props.size ? theme.spacing(props.size) : theme.spacing(6),
            height: props.size ? theme.spacing(props.size) : theme.spacing(6),
            cursor: props.onClick ? "pointer" : "default",
        },
    }));

    const classes = useStyles();
    return (
        <Avatar
            onClick={props.onClick}
            alt={props.displayName}
            src={props.avatarURL}
            className={classes.card}
        >
            {initials}
        </Avatar>
    );
});

UserAvatar.propTypes = {
    displayName: PropTypes.string,
    avatarURL: PropTypes.string,
    userUUID: PropTypes.string,
    size: PropTypes.number,
    onClick: PropTypes.func,
};

UserAvatar.defaultProps = {
    displayName: "",
    avatarURL: "",
    userUUID: "",
    size: undefined,
    onClick: undefined,
};

export default UserAvatar;
