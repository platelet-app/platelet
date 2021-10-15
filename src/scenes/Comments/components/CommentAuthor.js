import React from "react";
import UserAvatar from "../../../components/UserAvatar";
import { Link as RouterLink } from "react-router-dom";
import { encodeUUID } from "../../../utilities";
import { Tooltip } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { ThemedLink } from "../../../styles/common";
import { useTheme } from "@mui/material";

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
                        size={theme.spacing(5)}
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
