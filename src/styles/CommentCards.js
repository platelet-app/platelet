import Card from "@material-ui/core/Card";
import styled from "@material-ui/core/styles/styled";

const CommentCard = styled(Card)({
    padding: "10px",
    minHeight: "100px",
    width: "300px",

});
export const PublicCommentCard = styled(CommentCard)( {
    backgroundColor: "rgb(252, 252, 252)"
    });

export const PrivateCommentCard = styled(CommentCard)( {
    backgroundColor: "rgb(242, 242, 242)"
});
