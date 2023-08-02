import * as React from "react";
import { Dialog, Button, Portal, Card, TextInput } from "react-native-paper";

import { ResolvedComment } from "../hooks/useComments";

type CommentEditDialogProps = {
    comment: ResolvedComment | null;
    visible: boolean;
    onDismiss: () => void;
    onConfirm: (body: string) => void;
};

const CommentEditDialog: React.FC<CommentEditDialogProps> = ({
    comment,
    visible,
    onDismiss,
    onConfirm,
}) => {
    const [body, setBody] = React.useState(comment?.body || "");
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>Edit comment</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        key={visible ? "visible" : "hidden"}
                        placeholder="Edit comment..."
                        multiline
                        mode="outlined"
                        value={body}
                        onChangeText={setBody}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancel</Button>
                    <Button onPress={() => onConfirm(body)}>Save</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default CommentEditDialog;
