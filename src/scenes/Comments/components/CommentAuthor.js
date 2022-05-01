import React from "react";
import UserAvatar from "../../../components/UserAvatar";
import { Link as RouterLink } from "react-router-dom";
import { encodeUUID } from "../../../utilities";
import makeStyles from "@mui/styles/makeStyles";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { ThemedLink } from "../../../styles/common";

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
    const classes = useStyles();
    return (
        <Grid container alignItems={"center"} spacing={1} direction={"row"}>
            <Grid item>
                {props.disableLink ? (
                    <UserAvatar
                        size={5}
                        userUUID={props.uuid}
                        displayName={props.displayName}
                        thumbnailKey={props.thumbnailKey}
                    />
                ) : (
                    <ThemedLink
                        className={classes.avatar}
                        component={RouterLink}
                        to={"/user/" + encodeUUID(props.uuid)}
                    >
                        <UserAvatar
                            size={5}
                            userUUID={props.uuid}
                            displayName={props.displayName}
                            thumbnailKey={props.thumbnailKey}
                        />
                    </ThemedLink>
                )}
            </Grid>
            <Grid item>
                {props.disableLink ? (
                    <Typography>{props.displayName}</Typography>
                ) : (
                    <ThemedLink
                        className={classes.link}
                        component={RouterLink}
                        to={"/user/" + encodeUUID(props.uuid)}
                    >
                        <Typography>{props.displayName}</Typography>
                    </ThemedLink>
                )}
            </Grid>
        </Grid>
    );
});

CommentAuthor.propTypes = {
    userUUID: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    thumbnailKey: PropTypes.string,
    disableLink: PropTypes.bool,
};

CommentAuthor.defaultProps = {
    displayName: "Unknown User",
    thumbnailKey: "",
    disableLink: false,
};

export default CommentAuthor;
