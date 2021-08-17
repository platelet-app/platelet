import React from "react";
import UserAvatar from "../../../components/UserAvatar";
import { Link as RouterLink } from "react-router-dom";
import { encodeUUID } from "../../../utilities";
import { makeStyles, Tooltip } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { ThemedLink } from "../../../styles/common";
import { useTheme } from "@material-ui/core";

const useStyles = makeStyles({
    link: {
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    },
    avatar: { textDecoration: "none" },
});

const CommentAuthor = React.memo((props) => {
    const theme = useTheme();
    const classes = useStyles();
    return (
        <Grid container alignItems={"center"} spacing={1} direction={"row"}>
            <Grid item>
                <ThemedLink
                    className={classes.avatar}
                    component={RouterLink}
                    to={"/user/" + encodeUUID(props.uuid)}
                >
                    <UserAvatar
                        size={theme.spacing(0.6)}
                        userUUID={props.uuid}
                        displayName={props.displayName}
                        avatarURL={props.avatarURL}
                    />
                </ThemedLink>
            </Grid>
            <Grid item>
                <ThemedLink
                    className={classes.link}
                    component={RouterLink}
                    to={"/user/" + encodeUUID(props.uuid)}
                >
                    <Typography>{props.displayName}</Typography>
                </ThemedLink>
            </Grid>
        </Grid>
    );
});

export default CommentAuthor;
