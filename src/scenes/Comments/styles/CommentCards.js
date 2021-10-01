import Paper from "@material-ui/core/Paper";
import styled from "@material-ui/core/styles/styled";
import { makeStyles } from "@material-ui/core";

export const CommentCardStyled = styled(Paper)({
    position: "relative",
    minWidth: 220,
    maxWidth: 850,
    minHeight: 20,
    borderRadius: "1em",
    padding: 14,
});

export const PrivateCommentCardStyled = styled(Paper)({
    position: "relative",
    padding: 14,
    minWidth: 220,
    maxWidth: 850,
    minHeight: 20,
    borderRadius: "1em",
    "&::before": {
        pointerEvents: "none",
        borderRadius: "1em",
        content: '""',
        position: "absolute",
        background: "black",
        opacity: 0.15,
        width: "100%",
        height: "100%",
    },
});

export const commentStyles = makeStyles((theme) => ({
    newComment: {
        width: "100%",
        minWidth: 350,
    },
    newCommentTextField: {
        width: "100%",
    },
    gridItem: {
        width: "100%",
    },
    timeStamp: {
        fontStyle: "italic",
        opacity: 0.3,
        color: theme.palette.text.primary,
    },
    body: {
        whiteSpace: "pre-line",
        color: theme.palette.text.primary,
    },
    icon: {
        height: 20,
        width: 20,
    },
    lockIcon: {
        fill: "red",
    },
}));
