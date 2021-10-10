import React from "react";
import { encodeUUID } from "../utilities";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import UserAvatar from "./UserAvatar";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, styled, makeStyles } from "@material-ui/core";
import { ThemedLink, showHide } from "../styles/common";

const UserBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    paddingLeft: 10,
    width: "100%",
});

const useStyles = makeStyles((theme) => ({
    button: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    iconButton: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    root: {
        minWidth: 250,
    },
}));

export default function UserCard(props) {
    const classes = useStyles();
    const { show, hide } = showHide();

    const deleteButton = props.onDelete ? (
        <IconButton
            className={classes.iconButton}
            color={"inherit"}
            onClick={(event) => {
                event.preventDefault();
                props.onDelete();
            }}
        >
            <ClearIcon className={classes.button} />
        </IconButton>
    ) : (
        <></>
    );
    return (
        <ThemedLink
            to={"/user/" + encodeUUID(props.userUUID)}
            style={{ textDecoration: "none" }}
        >
            <UserBox>
                <Grid
                    container
                    className={classes.root}
                    spacing={1}
                    justify={"space-between"}
                    alignItems={"center"}
                    direction={"row"}
                >
                    <Grid item>
                        <Grid
                            container
                            spacing={2}
                            direction={"row"}
                            justify={"flex-start"}
                            alignItems={"center"}
                        >
                            <Grid item>
                                <UserAvatar
                                    size={props.compact ? 3 : 6}
                                    userUUID={props.userUUID}
                                    displayName={props.displayName}
                                    avatarURL={props.avatarURL}
                                />
                            </Grid>
                            <Grid item>
                                <Grid
                                    container
                                    spacing={1}
                                    alignItems={"flex-start"}
                                    direction={"column"}
                                >
                                    <Grid item>
                                        <Typography>
                                            {props.displayName}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        className={props.patch ? show : hide}
                                        item
                                    >
                                        <Typography>{props.patch}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>{deleteButton}</Grid>
                </Grid>
            </UserBox>
        </ThemedLink>
    );
}
