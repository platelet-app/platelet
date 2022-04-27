import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
    commentStyles,
    CommentCardStyled,
    PrivateCommentCardStyled,
} from "../styles/CommentCards";
import LockIcon from "@mui/icons-material/Lock";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import CommentAuthor from "./CommentAuthor";
import EditIcon from "@mui/icons-material/Edit";
import { showHide } from "../../../styles/common";
import { useSelector } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";
import { getWhoami } from "../../../redux/Selectors";
import { commentVisibility } from "../../../apiConsts";

const CommentCard = React.memo((props) => {
    const { show, hide } = showHide();
    const classes = commentStyles();
    const timeCreatedString = moment(props.timeCreated).calendar();
    const whoami = useSelector(getWhoami);
    const Card =
        props.visibility === commentVisibility.everyone
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
                props.author && whoami.id === props.author.id
                    ? "flex-end"
                    : "flex-start"
            }
            spacing={1}
        >
            {props.author && props.showAuthor && (
                <Grid item>
                    <CommentAuthor
                        uuid={props.author.id}
                        displayName={props.author.displayName}
                        thumbnailKey={
                            props.author && props.author.profilePictureThumbnail
                                ? props.author.profilePictureThumbnail.key
                                : null
                        }
                    />
                </Grid>
            )}
            <Grid item>
                <Card>
                    <Grid
                        container
                        direction={"row"}
                        justifyContent={"space-between"}
                    >
                        <Grid item>{props.children}</Grid>
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
                                        title={`Edited ${props.numEdits} ${
                                            props.numEdits === 1
                                                ? "time"
                                                : "times"
                                        }.`}
                                    >
                                        <EditIcon className={classes.icon} />
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        className={
                                            props.visibility ===
                                            commentVisibility.everyone
                                                ? hide
                                                : show
                                        }
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
                                            {props.timeCreated &&
                                                timeCreatedString}
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

CommentCard.propTypes = {
    author: PropTypes.object,
    visibility: PropTypes.oneOf(Object.values(commentVisibility)),
    showAuthor: PropTypes.bool,
    numEdits: PropTypes.number,
    timeCreated: PropTypes.string,
};

CommentCard.defaultProps = {
    author: {
        displayName: "",
        id: "",
        profilePictureThumbnailURL: "",
    },
    numEdits: 0,
    showAuthor: true,
    visibility: commentVisibility.me,
    timeCreated: undefined,
};

export default CommentCard;
