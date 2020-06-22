import React from "react";
import Card from '@material-ui/core/Card';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link"
import {encodeUUID} from "../../../utilities";
import {Link as RouterLink} from 'react-router-dom';
import Divider from "@material-ui/core/Divider";
import {PublicCommentCard, PrivateCommentCard} from "../../../styles/CommentCards";
import LockIcon from '@material-ui/icons/Lock';
import Tooltip from "@material-ui/core/Tooltip";


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
                    <Grid container direction={"row"} justify={"space-between"}>
                        <Grid item>
                            <Link component={RouterLink} to={"/user/" + encodeUUID(props.author.uuid)}>
                                <Typography style={{fontWeight: "bold"}}>{props.author.display_name}</Typography>
                            </Link>
                        </Grid>
                        <Grid item>
                            {props.public ? (
                                <></>
                            ) : (
                                <Tooltip title="Only visible to you">
                                    <LockIcon style={{height: "20px", width: "20px"}} color={"disabled"}/>
                                </Tooltip>
                            )}
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