import Grid from "@material-ui/core/Grid";
import CommentCard from "./CommentCard";
import React, {useEffect} from "react";
import NewCommentCard from "./NewCommentCard";
import {useSelector} from "react-redux";
import Typography from "@material-ui/core/Typography";
import CommentContextMenu from "../../../components/ContextMenus/CommentContextMenu";
import {createPostingSelector} from "../../../redux/selectors";

const initialSnack = {snack: () => {}}

export default function CommentsMain(props) {
    const [snack, setSnack] = React.useState(initialSnack)
    const whoami = useSelector(state => state.whoami.user);
    const deletingSelector = createPostingSelector(props.sidebar ? ["DELETE_SIDEBAR_COMMENT"] : ["DELETE_COMMENT"]);
    const isDeleting = useSelector(state => deletingSelector(state));

    function dispatchSnack() {
        if (!isDeleting) {
            snack.snack();
            setSnack(initialSnack)
        }
    }
    useEffect(dispatchSnack, [isDeleting])

    return (
        <Grid container spacing={3} direction={"column"} alignItems={"center"} >
            {props.comments.sort(
                (a, b) => new Date(a.time_created) - new Date(b.time_created)
            ).map((comment) => (
                <Grid item key={comment.uuid}>
                    <div style={{position: "relative"}}>
                        <CommentCard author={comment.author} public={comment.publicly_visible}>
                        {comment.body}
                    </CommentCard>
                        <div style={{
                            cursor: 'context-menu',
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            zIndex: 1000
                        }}>
                            <CommentContextMenu sidebar={props.sidebar} setSnack={(snack) => {setSnack(snack)}} comment={comment}/>
                        </div>
                    </div>
                </Grid>
            ))}
            <Grid item>
                <NewCommentCard sidebar={props.sidebar} parentUUID={props.parentUUID} author={whoami}/>
            </Grid>
        </Grid>
    )
}
