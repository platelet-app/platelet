import Card from "@material-ui/core/Card";
import styled from "@material-ui/core/styles/styled";

const CommentCard = styled(Card)({
    padding: "10px",
    minHeight: "100px",
    width: "300px",

});
export const PublicCommentCard = styled(CommentCard)( {
    //backgroundColor: "rgba(252, 252, 252, 0.1)"
    });

export const PrivateCommentCard = styled(CommentCard)( {
    //backgroundColor: "rgba(242, 242, 242, 0.1)"
});
