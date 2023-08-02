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
import { MenuItemProps } from "react-native-hold-menu/lib/typescript/components/menu/types";
import { useSelector } from "react-redux";
import { getWhoami } from "../../redux/Selectors";
import { HoldItem } from "react-native-hold-menu";
import * as Clipboard from "expo-clipboard";
import CopyTextSnack from "../../snacks/CopyTextSnack";
import GenericErrorSnack from "../../snacks/GenericErrorSnack";

type CommentsSectionProps = {
    parentId: string;
};

enum CommentItemMenuAction {
    EDIT,
    DELETE,
}

type ActionParams = {
    "Copy text"?: string[];
    Edit?: string[];
    Delete?: string[];
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ parentId }) => {
    const { state, error } = useComments(parentId);
    const [visibleDialog, setVisibleDialog] =
        React.useState<CommentItemMenuAction | null>(null);
    const [selectedComment, setSelectedComment] =
        React.useState<ResolvedComment | null>(null);
    const whoami = useSelector(getWhoami);
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
                    await DataStore.delete(updated);
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

    const handleChangeSelectedComment = (commentId: string) => {
        const comment = state.find((c) => c.id === commentId);
        if (comment) {
            setSelectedComment(comment);
        }
    };

    const copyText = async (commentId: string) => {
        try {
            const comment = await DataStore.query(models.Comment, commentId);
            if (comment) {
                const text = comment.body;
                if (text) {
                    Clipboard.setString(text);
                }
            }
        } catch (e) {
            console.log(e);
            setErrorSnackVisible(true);
        }
        setCopyTextSnackVisible(true);
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

                        let actionParams: ActionParams = {
                            "Copy text": [comment.id],
                        };
                        let menuItems: MenuItemProps[] = [
                            {
                                text: "Copy text",
                                onPress: copyText,
                            },
                        ];

                        const isSelf = comment.author?.id === whoami?.id;
                        if (isSelf) {
                            menuItems = [
                                ...menuItems,
                                {
                                    text: "Edit",
                                    onPress: (commentId: string) => {
                                        setVisibleDialog(
                                            CommentItemMenuAction.EDIT
                                        );
                                        handleChangeSelectedComment(commentId);
                                    },
                                },
                                {
                                    text: "Delete",
                                    isDestructive: true,
                                    onPress: (commentId: string) => {
                                        setVisibleDialog(
                                            CommentItemMenuAction.DELETE
                                        );
                                        handleChangeSelectedComment(commentId);
                                    },
                                },
                            ];
                            actionParams = {
                                ...actionParams,
                                Edit: [comment.id],
                                Delete: [comment.id],
                            };
                        }

                        return (
                            <HoldItem
                                key={comment.id}
                                items={menuItems}
                                actionParams={actionParams}
                            >
                                <CommentItem
                                    showAuthor={
                                        prevAuthorId !== comment.author?.id
                                    }
                                    comment={comment}
                                />
                            </HoldItem>
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
