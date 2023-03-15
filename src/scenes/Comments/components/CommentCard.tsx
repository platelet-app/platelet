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
import { getWhoami } from "../../../redux/Selectors";
import { commentVisibility } from "../../../apiConsts";
import * as models from "../../../models";
import { User } from "../../../API";

type CommentCardProps = {
    author?: models.User | User | null;
    visibility?: any;
    showAuthor?: boolean;
    numEdits?: number;
    timeCreated?: string;
    children: React.ReactNode;
};

type CardProps = {
    children: React.ReactNode;
};

const CommentCard: React.FC<CommentCardProps> = React.memo(
    ({
        author,
        visibility,
        showAuthor,
        children,
        numEdits = 0,
        timeCreated,
    }) => {
        const { show, hide } = showHide().classes;
        const { classes } = commentStyles();
        const timeCreatedString = moment(timeCreated).calendar();
        const whoami = useSelector(getWhoami);
        const Card: React.FC<CardProps> =
            visibility === commentVisibility.everyone
                ? ({ children }) => (
                      <CommentCardStyled>{children}</CommentCardStyled>
                  )
                : ({ children }) => (
                      <PrivateCommentCardStyled>
                          {children}
                      </PrivateCommentCardStyled>
                  );

        return (
            <Grid
                container
                direction={"column"}
                wrap={"nowrap"}
                alignItems={
                    author && whoami.id === author.id
                        ? "flex-end"
                        : "flex-start"
                }
                spacing={1}
            >
                {author && showAuthor && (
                    <Grid item>
                        <CommentAuthor
                            userId={author.id}
                            displayName={author.displayName}
                            thumbnailKey={
                                author && author.profilePicture
                                    ? author.profilePicture.key
                                    : ""
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
                            <Grid item>{children}</Grid>
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
                                                numEdits && numEdits !== 0
                                                    ? show
                                                    : hide
                                            }
                                            title={`Edited ${numEdits} ${
                                                numEdits === 1
                                                    ? "time"
                                                    : "times"
                                            }.`}
                                        >
                                            <EditIcon
                                                className={classes.icon}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip
                                            className={
                                                visibility ===
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
                                            title={moment(timeCreated).format(
                                                "yyyy-MM-DD HH:mm"
                                            )}
                                        >
                                            <Typography
                                                className={classes.timeStamp}
                                            >
                                                {timeCreated &&
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
    }
);

export default CommentCard;
