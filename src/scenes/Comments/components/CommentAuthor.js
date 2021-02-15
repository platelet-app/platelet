import React from "react";
import Grid from "@material-ui/core/Grid";
import UserAvatar from "../../../components/UserAvatar";
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import {encodeUUID} from "../../../utilities";
import Typography from "@material-ui/core/Typography";
import {ThemedLink} from "../../../styles/common";

const CommentAuthor = React.memo((props) => {
    return (
        <Grid container direction={"row"} justify={"flex-start"} spacing={2} alignItems={"center"}>
            <Grid item>
                <UserAvatar userUUID={props.uuid} displayName={props.displayName}
                            avatarURL={props.avatarURL}/>
            </Grid>
            <Grid item>
                <ThemedLink component={RouterLink} to={"/user/" + encodeUUID(props.uuid)}>
                    <Typography
                        style={{fontWeight: "bold"}}>{props.displayName}</Typography>
                </ThemedLink>
            </Grid>
        </Grid>
    )
})

export default CommentAuthor;
