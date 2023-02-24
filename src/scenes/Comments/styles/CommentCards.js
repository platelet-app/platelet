import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";

export const CommentCardStyled = styled(Paper)({
    position: "relative",
    minWidth: 220,
    maxWidth: 850,
    minHeight: 20,
    borderRadius: "1em",
});

export const PrivateCommentCardStyled = styled(Paper)({
    position: "relative",
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

export const commentStyles = makeStyles()((theme) => ({
    newComment: {
        width: "100%",
        minWidth: 350,
        padding: 14,
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
    editTextField: {
        padding: 14,
    },
    body: {
        whiteSpace: "pre-line",
        padding: 14,
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
