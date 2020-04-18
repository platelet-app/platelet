import Grid from "@material-ui/core/Grid";
import CommentCard from "./CommentCard";
import React from "react";
import NewCommentCard from "./NewCommentCard";
import {useSelector} from "react-redux";
import Typography from "@material-ui/core/Typography";

export default function CommentsMain(props) {
    const whoami = useSelector(state => state.whoami);
    return (
        <Grid container spacing={3} direction={"column"} alignItems={"center"} >
            {props.comments.map((comment) => (
                <Grid item>
                    <CommentCard author={comment.author} public={comment.publicly_visible}>
                        <Typography>{comment.body}</Typography>
                    </CommentCard>
                </Grid>
            ))}
            <Grid item>
                <NewCommentCard parentUUID={props.parentUUID} author={whoami}/>
            </Grid>
        </Grid>
    )
}
