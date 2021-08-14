import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
    PublicCommentCard,
    PrivateCommentCard,
    commentStyles,
} from "../styles/CommentCards";
import LockIcon from "@material-ui/icons/Lock";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";
import CommentAuthor from "./CommentAuthor";
import EditIcon from "@material-ui/icons/Edit";
import { showHide } from "../../../styles/common";
import { useSelector } from "react-redux";

const CommentCard = React.memo((props) => {
    const { show, hide } = showHide();
    const classes = commentStyles();
    const timeCreatedString = moment(props.timeCreated).calendar();
    const whoami = useSelector((state) => state.whoami.user);
    const Card = props.public
        ? (props) => {
              return <PublicCommentCard>{props.children}</PublicCommentCard>;
          }
        : (props) => {
              return <PrivateCommentCard>{props.children}</PrivateCommentCard>;
          };
    return (
        <Grid
            container
            direction={
                whoami.uuid === props.author.uuid ? "row" : "row-reverse"
            }
            alignItems={"flex-start"}
            spacing={1}
        >
            <Grid item>
                <CommentAuthor
                    uuid={props.author.uuid}
                    displayName={props.author.display_name}
                    avatarURL={props.author.profile_picture_thumbnail_url}
                />
            </Grid>
            <Grid item>
                <Grid
                    container
                    direction={"row"}
                    justify={"space-between"}
                    className={classes.speechBubble}
                >
                    <Grid item>
                        <Typography className={classes.body} align={"justify"}>
                            {props.children}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid
                            container
                            spacing={1}
                            style={{ paddingTop: 20, paddingRight: 14 }}
                            direction={"row"}
                        >
                            <Grid item>
                                <Tooltip
                                    className={
                                        props.numEdits && props.numEdits !== "0"
                                            ? show
                                            : hide
                                    }
                                    title={`Edited ${props.numEdits} times.`}
                                >
                                    <EditIcon
                                        style={{
                                            height: "20px",
                                            width: "20px",
                                        }}
                                        color={"disabled"}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip
                                    className={props.public ? hide : show}
                                    title="Only visible to you"
                                >
                                    <LockIcon
                                        style={{
                                            height: "20px",
                                            width: "20px",
                                        }}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title={props.timeCreated}>
                                    <Typography className={classes.timeStamp}>
                                        {timeCreatedString}
                                    </Typography>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
});

export default CommentCard;
