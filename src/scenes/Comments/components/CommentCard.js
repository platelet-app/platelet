import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
    commentStyles,
    CommentCardStyled,
    PrivateCommentCardStyled,
} from "../styles/CommentCards";
import LockIcon from "@material-ui/icons/Lock";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";
import CommentAuthor from "./CommentAuthor";
import EditIcon from "@material-ui/icons/Edit";
import { showHide } from "../../../styles/common";
import { useSelector } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";
import { getWhoami } from "../../../redux/Selectors";

const CommentCard = React.memo((props) => {
    const { show, hide } = showHide();
    const classes = commentStyles();
    const timeCreatedString = moment(props.timeCreated).calendar();
    const whoami = useSelector(getWhoami);
    const Card = props.public
        ? (props) => <CommentCardStyled>{props.children}</CommentCardStyled>
        : (props) => (
              <PrivateCommentCardStyled>
                  {props.children}
              </PrivateCommentCardStyled>
          );
    return (
        <Grid
            container
            direction={"column"}
            wrap={"nowrap"}
            alignItems={
                whoami.id === props.author.uuid ? "flex-end" : "flex-start"
            }
            spacing={1}
        >
            <Grid item className={props.showAuthor ? show : hide}>
                <CommentAuthor
                    uuid={props.author.id}
                    displayName={props.author.displayName}
                    avatarURL={props.author.profilePictureThumbnailURL}
                />
            </Grid>
            <Grid item>
                <Card>
                    <Grid container direction={"row"} justify={"space-between"}>
                        <Grid item>
                            <Typography
                                className={classes.body}
                                align={"justify"}
                            >
                                {props.children}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Grid
                                container
                                spacing={1}
                                alignItems={"center"}
                                style={{ paddingTop: 20, paddingRight: 14 }}
                                direction={"row"}
                            >
                                <Grid item>
                                    <Tooltip
                                        className={
                                            props.numEdits &&
                                            props.numEdits !== "0"
                                                ? show
                                                : hide
                                        }
                                        title={`Edited ${props.numEdits} times.`}
                                    >
                                        <EditIcon
                                            className={classes.icon}
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
                                            className={clsx(
                                                classes.icon,
                                                classes.lockIcon
                                            )}
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        title={moment(props.timeCreated).format(
                                            "yyyy-MM-DD HH:mm"
                                        )}
                                    >
                                        <Typography
                                            className={classes.timeStamp}
                                        >
                                            {timeCreatedString}
                                        </Typography>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
});

CommentCard.PropTypes = {
    author: PropTypes.object,
    public: PropTypes.bool,
    showAuthor: PropTypes.bool,
    numEdits: PropTypes.number,
    timeCreated: PropTypes.string,
};

CommentCard.defaultProps = {
    author: {
        display_name: "",
        uuid: "",
        profile_picture_thumbnail_url: "",
    },
    numEdits: 0,
    showAuthor: true,
    public: false,
    timeCreated: undefined,
};

export default CommentCard;
