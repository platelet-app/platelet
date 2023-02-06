import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import seedrandom from "seedrandom";
import { makeStyles } from 'tss-react/mui';
import PropTypes from "prop-types";
import { generateS3Link } from "../amplifyUtilities";

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
    const [avatarURL, setAvatarURL] = useState(null);

    const getThumbnail = React.useCallback(async () => {
        if (props.thumbnailKey) {
            try {
                const result = await generateS3Link(props.thumbnailKey, true);
                if (result) {
                    setAvatarURL(result);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }, [props.thumbnailKey]);

    useEffect(() => getThumbnail(), [props.thumbnailKey, getThumbnail]);

    const useStyles = makeStyles()((theme) => ({
        card: {
            color: theme.palette.getContrastText(avatarFallbackColor),
            backgroundColor: avatarFallbackColor,
            width: props.size ? theme.spacing(props.size) : theme.spacing(6),
            height: props.size ? theme.spacing(props.size) : theme.spacing(6),
            cursor: props.onClick ? "pointer" : "default",
        },
    }));

    const { classes } = useStyles();
    return (
        <Avatar
            onClick={props.onClick}
            alt={props.displayName}
            src={avatarURL}
            className={classes.card}
        >
            {initials}
        </Avatar>
    );
});

UserAvatar.propTypes = {
    displayName: PropTypes.string,
    thumbnailKey: PropTypes.string,
    userUUID: PropTypes.string,
    size: PropTypes.number,
    onClick: PropTypes.func,
};

UserAvatar.defaultProps = {
    displayName: "",
    thumbnailKey: null,
    userUUID: "",
    size: undefined,
    onClick: undefined,
};

export default UserAvatar;
