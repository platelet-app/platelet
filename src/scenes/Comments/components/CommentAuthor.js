import React from "react";
import UserAvatar from "../../../components/UserAvatar";
import { Link as RouterLink } from "react-router-dom";
import { encodeUUID } from "../../../utilities";
import { Tooltip } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { ThemedLink } from "../../../styles/common";
import { useTheme } from "@material-ui/core";

const CommentAuthor = React.memo((props) => {
    const theme = useTheme();
    return (
        <Tooltip title={props.displayName}>
            <ThemedLink
                style={{ textDecoration: "none" }}
                component={RouterLink}
                to={"/user/" + encodeUUID(props.uuid)}
            >
                <Grid
                    container
                    alignItems={"center"}
                    spacing={1}
                    direction={"row"}
                >
                    <Grid item>
                        <UserAvatar
                            size={theme.spacing(0.6)}
                            userUUID={props.uuid}
                            displayName={props.displayName}
                            avatarURL={props.avatarURL}
                        />
                    </Grid>
                    <Grid item>
                        <Typography>{props.displayName}</Typography>
                    </Grid>
                </Grid>
            </ThemedLink>
        </Tooltip>
    );
});

export default CommentAuthor;
