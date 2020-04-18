import React, {useState} from "react";
import Card from '@material-ui/core/Card';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link"
import {encodeUUID} from "../utilities";
import {Link as RouterLink} from 'react-router-dom';
import Divider from "@material-ui/core/Divider";
import {PublicCommentCard, PrivateCommentCard} from "../css/CommentCards";
import LockIcon from '@material-ui/icons/Lock';
import Tooltip from "@material-ui/core/Tooltip";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import IconButton from "@material-ui/core/IconButton";
import {TextFieldControlled, TextFieldUncontrolled} from "./TextFieldControlled";
import Button from "@material-ui/core/Button";
import {useDispatch} from "react-redux";
import {addComment} from "../redux/comments/Actions";

export default function CommentCard(props) {
    const dispatch = useDispatch();
    const [publicComment, setPublicComment] = useState(true);
    const [commentContents, setCommentContents] = useState("");
    return (
        <PublicCommentCard>
            <Grid container direction={"column"} alignItems={"flex-start"} spacing={1}>
                <Grid item style={{width: "280px"}}>
                    <Grid container direction={"row"} justify={"space-between"}>
                        <Grid item>
                            <Typography style={{fontWeight: "bold"}}>{props.author.display_name}</Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title={publicComment ? "Visible to everyone" : "Only visible to you"}>
                                <IconButton onClick={() => {setPublicComment(!publicComment)}}>
                                {publicComment ? (
                                    <LockOpenIcon style={{height: "20px", width: "20px"}} color={"primary"}/>
                                ) : (
                                    <LockIcon style={{height: "20px", width: "20px"}} color={"primary"}/>
                                )}
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider style={{width: "280px"}}/>
                </Grid>
                <Grid item>
                    <TextFieldUncontrolled key={"new-comment-field"} id={"new-comment-field"} style={{width: "280px"}} multiline={true} value={commentContents} onChange={(e) => setCommentContents(e.target.value)}/>
                </Grid>
                <Grid style={{width: "280px"}} item>
                    <Grid container direction={"row"} justify={"space-between"}>
                        <Grid item>
                            <Button onClick={() => {
                                dispatch(addComment({
                                    author: props.author,
                                    parent_uuid: props.parentUUID,
                                    publicly_visible: publicComment,
                                    body: commentContents}));
                                setCommentContents("");
                            }
                            }>
                                Save
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={() => setCommentContents("")}>Discard</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </PublicCommentCard>
    )
}
