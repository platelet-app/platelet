import * as React from "react";
import { View } from "react-native";
import useComments, { ResolvedComment } from "../../hooks/useComments";
import GenericError from "../../screens/Errors/GenericError";
import CommentItem from "./CommentItem";
import NewCommentCard from "./NewCommentCard";
import * as models from "../../models";
import CommentDeleteConfirmationDialog from "./CommentDeleteConfirmationDialog";
import CommentEditDialog from "./CommentEditDialog";
import { DataStore } from "aws-amplify";
import CopyTextSnack from "../../snacks/CopyTextSnack";
import GenericErrorSnack from "../../snacks/GenericErrorSnack";

type CommentsSectionProps = {
    parentId: string;
};

export enum CommentItemMenuAction {
    EDIT,
    DELETE,
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ parentId }) => {
    const { state, error } = useComments(parentId);
    const [visibleDialog, setVisibleDialog] =
        React.useState<CommentItemMenuAction | null>(null);
    const [selectedComment, setSelectedComment] =
        React.useState<ResolvedComment | null>(null);
    const [copyTextSnackVisible, setCopyTextSnackVisible] =
        React.useState(false);
    const [errorSnackVisible, setErrorSnackVisible] = React.useState(false);

    const deleteComment = async () => {
        setVisibleDialog(null);
        try {
            if (selectedComment) {
                const existingComment = await DataStore.query(
                    models.Comment,
                    selectedComment.id
                );
                if (existingComment) {
                    const updated = await DataStore.save(
                        models.Comment.copyOf(existingComment, (upd) => {
                            upd.body = "";
                        })
                    );
                    const toDelete = await DataStore.query(
                        models.Comment,
                        updated.id
                    );
                    if (toDelete) await DataStore.delete(toDelete);
                }
            }
        } catch (e) {
            console.log(e);
            setErrorSnackVisible(true);
        }
        setSelectedComment(null);
    };

    const editComment = async (body: string) => {
        setVisibleDialog(null);
        try {
            if (selectedComment) {
                const existingComment = await DataStore.query(
                    models.Comment,
                    selectedComment.id
                );
                if (existingComment) {
                    await DataStore.save(
                        models.Comment.copyOf(existingComment, (upd) => {
                            upd.body = body;
                        })
                    );
                }
            }
        } catch (e) {
            console.log(e);
            setErrorSnackVisible(true);
        }
        setSelectedComment(null);
    };

    const handleDismiss = () => {
        setVisibleDialog(null);
        setSelectedComment(null);
    };

    if (error) {
        return <GenericError />;
    } else {
        return (
            <View style={{ gap: 4 }}>
                {state
                    .sort(
                        (a, b) =>
                            +new Date(a.createdAt || new Date()) -
                            +new Date(b.createdAt || new Date())
                    )
                    .map((comment, index, array) => {
                        const prevAuthorId =
                            index > 0 && array[index - 1].author
                                ? array[index - 1].author?.id
                                : null;
                        return (
                            <CommentItem
                                key={comment.id}
                                showAuthor={prevAuthorId !== comment.author?.id}
                                comment={comment}
                                setAction={(action) => {
                                    setVisibleDialog(action);
                                    setSelectedComment(comment);
                                }}
                            />
                        );
                    })}
                <NewCommentCard parentId={parentId} />
                <CommentDeleteConfirmationDialog
                    key={
                        visibleDialog === CommentItemMenuAction.DELETE
                            ? "commentDeleteDialogVisible"
                            : "commentDeleteDialogHidden"
                    }
                    visible={visibleDialog === CommentItemMenuAction.DELETE}
                    comment={selectedComment}
                    onConfirm={deleteComment}
                    onDismiss={handleDismiss}
                />
                <CommentEditDialog
                    key={
                        visibleDialog === CommentItemMenuAction.EDIT
                            ? "commentEditDialogVisible"
                            : "commentEditDialogHidden"
                    }
                    visible={visibleDialog === CommentItemMenuAction.EDIT}
                    comment={selectedComment}
                    onDismiss={handleDismiss}
                    onConfirm={editComment}
                />
                <CopyTextSnack
                    visible={copyTextSnackVisible}
                    onDismiss={() => setCopyTextSnackVisible(false)}
                />
                <GenericErrorSnack
                    visible={errorSnackVisible}
                    onDismiss={() => setErrorSnackVisible(false)}
                />
            </View>
        );
    }
};

export default CommentsSection;
