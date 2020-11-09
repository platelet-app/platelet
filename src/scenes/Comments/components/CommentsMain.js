import Grid from "@material-ui/core/Grid";
import CommentCard from "./CommentCard";
import React from "react";
import NewCommentCard from "./NewCommentCard";
import {useSelector} from "react-redux";
import CommentContextMenu from "../../../components/ContextMenus/CommentContextMenu";
import {contextDots} from "../../../styles/common"


export default function CommentsMain(props) {
    const whoami = useSelector(state => state.whoami.user);
    const classes = contextDots();

    return (
        <Grid container spacing={3} direction={"column"} alignItems={"center"} >
            {props.comments.sort(
                (a, b) => new Date(a.time_created) - new Date(b.time_created)
            ).map((comment) => (
                <Grid item key={comment.uuid}>
                    <div style={{position: "relative"}}>
                        <CommentCard
                            author={comment.author}
                            timeCreated={comment.time_created}
                            numEdits={comment.num_edits}
                            public={comment.publicly_visible}>
                        {comment.body}
                    </CommentCard>
                        {whoami.roles.includes("admin") || whoami.uuid === comment.author_uuid ?
                            <div className={classes.root}>
                                <CommentContextMenu
                                    comment={comment}/>
                            </div>
                         : <></> }
                    </div>
                </Grid>
            ))}
            <Grid item>
                <NewCommentCard sidebar={props.sidebar} parentUUID={props.parentUUID} author={whoami}/>
            </Grid>
        </Grid>
    )
}
