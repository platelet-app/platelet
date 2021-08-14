import Card from "@material-ui/core/Card";
import styled from "@material-ui/core/styles/styled";
import { makeStyles } from "@material-ui/core";

const CommentCard = styled(Card)({
    padding: "10px",
    minHeight: "100px",
    width: "300px",
});

export const commentStyles = makeStyles((theme) => ({
    speechBubble: {
        position: "relative",
        minWidth: 220,
        maxWidth: 800,
        minHeight: 20,
        background: theme.palette.background.paper,
        borderRadius: "1em",

        //        "&::after": {
        //            content: '""',
        //            position: "absolute",
        //            left: 0,
        //            top: "50%",
        //            width: 0,
        //            height: 0,
        //            border: "34px solid transparent",
        //            borderRightColor:
        //                theme.palette.type === "dark"
        //                    ? theme.palette.background.paper
        //                    : theme.palette.primary.main,
        //            borderLeft: 0,
        //            borderTop: 0,
        //            marginTop: "-17px",
        //            marginLeft: "-34px",
        //        },
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
}));

export const PublicCommentCard = styled(CommentCard)({
    //backgroundColor: "rgba(252, 252, 252, 0.1)"
});

export const PrivateCommentCard = styled(CommentCard)({
    //backgroundColor: "rgba(242, 242, 242, 0.1)"
});
