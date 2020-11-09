import Grid from "@material-ui/core/Grid";
import CommentCard from "./CommentCard";
import React, {useState} from "react";
import NewCommentCard from "./NewCommentCard";
import {useSelector} from "react-redux";
import CommentContextMenu from "../../../components/ContextMenus/CommentContextMenu";
import {contextDots} from "../../../styles/common"
import {Typography} from "@material-ui/core";
import CommentCardEditMode from "./CommentCardEditMode";


function CommentCollection(props) {
    const classes = contextDots();
    const [editMode, setEditMode] = useState(false);
    return (
    <div style={{position: "relative"}}>
        {editMode ?
            <CommentCardEditMode
                body={props.body}
                onCancel={() => setEditMode(false)}
            />
            :
            <CommentCard
                author={props.author}
                timeCreated={props.timeCreated}
                numEdits={props.numEits}
                public={props.publiclyVisible}>
                <Typography>{props.body}</Typography>
            </CommentCard>
        }
        <div className={classes.root}>
            {props.showContextMenu && !editMode ?
                <CommentContextMenu
                    commentUUID={props.uuid}
                    onSetEditMode={() => setEditMode(true)}
                /> : <></>}
        </div>
    </div>
    )

}

export default function CommentsMain(props) {
    const whoami = useSelector(state => state.whoami.user);
    return (
        <Grid container spacing={3} direction={"column"} alignItems={"center"} >
            {props.comments.sort(
                (a, b) => new Date(a.time_created) - new Date(b.time_created)
            ).map((comment) => (
                <Grid item key={comment.uuid}>
                    <CommentCollection
                        showContextMenu={(whoami.roles.includes("admin") || whoami.uuid === comment.author_uuid)}
                        author={comment.author}
                        timeCreated={comment.time_created}
                        numEdits={comment.num_edits}
                        publiclyVisible={comment.publicly_visible}
                        uuid={comment.uuid}
                        body={comment.body}
                        />
                </Grid>
            ))}
            <Grid item>
                <NewCommentCard sidebar={props.sidebar} parentUUID={props.parentUUID} author={whoami}/>
            </Grid>
        </Grid>
    )
}
