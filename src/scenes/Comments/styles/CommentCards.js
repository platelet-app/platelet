import Card from "@material-ui/core/Card";
import styled from "@material-ui/core/styles/styled";
import { makeStyles } from "@material-ui/core";

const CommentCard = styled(Card)({
    padding: "10px",
    minHeight: "100px",
    minWidth: "300px",
});

export const commentStyles = makeStyles((theme) => ({
    speechBubblePrivate: {
        position: "relative",
        minWidth: 220,
        maxWidth: 850,
        minHeight: 20,
        background: theme.palette.background.paper,
        borderRadius: "1em",
        "&::before": {
            pointerEvents: "none",
            borderRadius: "1em",
            content: '""',
            position: "absolute",
            background: "black",
            opacity: 0.1,
            width: "100%",
            height: "100%",
        },
    },
    speechBubble: {
        position: "relative",
        minWidth: 220,
        maxWidth: 850,
        minHeight: 20,
        background: theme.palette.background.paper,
        borderRadius: "1em",
    },
    newComment: {
        width: "50%",
        minWidth: 350,
    },
    timeStamp: {
        fontStyle: "italic",
        opacity: 0.3,
        color: theme.palette.text.primary,
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
