import React from "react";
import Avatar from "@material-ui/core/Avatar";
import seedrandom from 'seedrandom'
import makeStyles from "@material-ui/core/styles/makeStyles";

const ctx = document.createElement('canvas').getContext('2d')

const colorToHex = color => {
    ctx.fillStyle = color;
    return ctx.fillStyle
}

const PHI = 1.618033988749895

const generateColorFromString = str =>
    colorToHex(
        `hsl(${Math.floor(((seedrandom(str)() + 1 / PHI) % 1) * 360)}, 50%, 50%)`,
    )

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}


const UserAvatar = React.memo((props) => {
    const nameArray = props.displayName.split(" ");
    const reducer = (accumulator, currentValue) => accumulator + currentValue[0];
    const initials = nameArray.reduce(reducer, '').slice(0, 2);
    const avatarFallbackColor = generateColorFromString(props.userUUID);

    const useStyles = makeStyles((theme) => ({
        card: {
            color: theme.palette.getContrastText(avatarFallbackColor),
            backgroundColor: avatarFallbackColor,
            width: props.size ? theme.spacing(props.size) : theme.spacing(6),
            height: props.size ? theme.spacing(props.size) : theme.spacing(6)
        },
    }));

    const classes = useStyles();
    return (
        <Avatar alt={props.displayName} src={props.avatarURL} className={classes.card}>{initials}</Avatar>
    )
})

export default UserAvatar;