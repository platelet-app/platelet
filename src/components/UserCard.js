import React from "react";
import {StyledSharpCard} from "../css/common";
import {Link} from "react-router-dom";
import {encodeUUID} from "../utilities";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import seedrandom from 'seedrandom'

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

export default function UserCard(props) {
    const nameArray = props.user.display_name.split(" ");
    const reducer = (accumulator, currentValue) => accumulator + currentValue[0];
    const initials = nameArray.reduce(reducer, '').slice(0, 2);
    const avatarFallbackColor = generateColorFromString(props.user.uuid);
    const useStyles = makeStyles((theme) => ({
        card: {
            color: theme.palette.getContrastText(avatarFallbackColor),
            backgroundColor: avatarFallbackColor,
            width: theme.spacing(6),
            height: theme.spacing(6)
        },
    }));

    const classes = useStyles();
    return (
        <Link to={"/user/" + encodeUUID(props.user.uuid)}
              style={{textDecoration: 'none'}}>
            <StyledSharpCard style={{width: "340px", height: "100px"}}>
                <Grid container spacing={2} direction={"row"} justify={"flex-start"} alignItems={"center"}>
                    <Grid item>
                        <Avatar src={props.user.avatar_url} className={classes.card}>{initials}</Avatar>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={1} alignItems={"flex-start"} direction={"column"}>
                            <Grid item>
                                <Typography>{props.user.display_name}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography>{props.user.patch}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </StyledSharpCard>
        </Link>
    )
}
