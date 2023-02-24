import React from "react";
import { encodeUUID } from "../utilities";
import Typography from "@mui/material/Typography";
import UserAvatar from "./UserAvatar";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, Stack, styled } from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { ThemedLink } from "../styles/common";

const UserBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    paddingLeft: 10,
    width: "100%",
    maxWidth: 500,
});

const useStyles = makeStyles()((theme) => ({
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
        minHeight: 50,
    },
}));

export default function UserCard(props) {
    const { classes } = useStyles();
    const deleteButton = props.onDelete ? (
        <IconButton
            aria-label="delete"
            className={classes.iconButton}
            color={"inherit"}
            onClick={(event) => {
                event.preventDefault();
                props.onDelete();
            }}
            size="large"
        >
            <ClearIcon className={classes.button} />
        </IconButton>
    ) : (
        <></>
    );
    return (
        <ThemedLink
            to={"/user/" + encodeUUID(props.userUUID)}
            style={{ width: "100%", textDecoration: "none" }}
        >
            <UserBox>
                <Stack
                    className={classes.root}
                    spacing={1}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    direction={"row"}
                >
                    <Stack
                        spacing={2}
                        direction={"row"}
                        justifyContent={"flex-start"}
                        alignItems={"center"}
                    >
                        <UserAvatar
                            size={props.compact ? 3 : 6}
                            userUUID={props.userUUID}
                            displayName={props.displayName}
                            thumbnailKey={props.thumbnailKey}
                        />
                        <Stack
                            spacing={1}
                            alignItems={"flex-start"}
                            direction={"column"}
                        >
                            <Typography>{props.displayName}</Typography>
                            {props.riderResponsibility ? (
                                <Typography>
                                    {props.riderResponsibility}
                                </Typography>
                            ) : (
                                <></>
                            )}
                        </Stack>
                    </Stack>
                    {deleteButton}
                </Stack>
            </UserBox>
        </ThemedLink>
    );
}
