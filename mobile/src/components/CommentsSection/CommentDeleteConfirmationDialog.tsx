import {
    Text,
    Dialog,
    Button,
    Portal,
    Card,
    useTheme,
} from "react-native-paper";

import { ResolvedComment } from "../hooks/useComments";

type CommentDeleteConfirmationDialogProps = {
    comment: ResolvedComment | null;
    visible: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
};

const CommentDeleteConfirmationDialog: React.FC<
    CommentDeleteConfirmationDialogProps
> = ({ comment, visible, onDismiss, onConfirm }) => {
    const { colors } = useTheme();
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>Delete this comment?</Dialog.Title>
                <Dialog.Content>
                    <Card>
                        <Card.Content>
                            <Text>{comment?.body}</Text>
                        </Card.Content>
                    </Card>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancel</Button>
                    <Button
                        textColor={colors.error}
                        onPress={() => onConfirm()}
                    >
                        Delete
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default CommentDeleteConfirmationDialog;
