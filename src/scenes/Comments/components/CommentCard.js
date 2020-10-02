import React from "react";
import Card from '@material-ui/core/Card';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link"
import {encodeUUID} from "../../../utilities";
import {Link as RouterLink} from 'react-router-dom';
import Divider from "@material-ui/core/Divider";
import {PublicCommentCard, PrivateCommentCard} from "../styles/CommentCards";
import LockIcon from '@material-ui/icons/Lock';
import Tooltip from "@material-ui/core/Tooltip";
import ScheduleIcon from '@material-ui/icons/Schedule';
import moment from "moment";
import UserAvatar from "../../../components/UserAvatar";
import CommentAuthor from "./CommentAuthor";


const CommentCard = React.memo((props) => {
    const Card = props.public ? (props) => {
            return <PublicCommentCard>{props.children}</PublicCommentCard>
        } :
        (props) => {
            return <PrivateCommentCard>{props.children}</PrivateCommentCard>
        };
    return (
        <Card>
            <Grid container direction={"column"} alignItems={"flex-start"} spacing={1}>
                <Grid item style={{width: "280px"}}>
                    <Grid container direction={"row"} justify={"space-between"} alignItems={"center"}>
                        <Grid item>
                            <CommentAuthor
                                uuid={props.author.uuid}
                                displayName={props.author.display_name}
                                avatarURL={props.author.profile_picture_thumbnail_url}/>
                        </Grid>
                        <Grid item>
                            {props.public ? (
                                <></>
                            ) : (
                                <Tooltip title="Only visible to you">
                                    <LockIcon style={{height: "20px", width: "20px"}} color={"disabled"}/>
                                </Tooltip>
                            )}
                            <Tooltip title={moment(props.timeCreated).calendar()}>
                                <ScheduleIcon style={{height: "20px", width: "20px"}} color={"disabled"}/>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider style={{width: "280px"}}/>
                </Grid>
                <Grid item>
                    <Typography align={"justify"}>{props.children}</Typography>
                </Grid>
            </Grid>
        </Card>
    )
})

export default CommentCard;
