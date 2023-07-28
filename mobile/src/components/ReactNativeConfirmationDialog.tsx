import * as React from "react";
import { Button, Dialog, Portal } from "react-native-paper";

type ReactNativeConfirmationDialogProps = {
    open: boolean;
    onConfirmation: () => void;
    onCancel: () => void;
    onClose: () => void;
    dialogTitle: string;
    fullScreen: boolean;
    disabled: boolean;
    children: React.ReactNode;
};

const ReactNativeConfirmationDialog: React.FC<
    ReactNativeConfirmationDialogProps
> = ({
    open = false,
    onConfirmation,
    onCancel,
    onClose = () => {},
    dialogTitle = "",
    fullScreen = false,
    disabled = false,
    children,
}) => {
    return (
        <Portal>
            <Dialog
                visible={open}
                onDismiss={onClose}
                style={{ margin: 16 }}
                dismissable={!disabled}
            >
                <Dialog.Title>{dialogTitle}</Dialog.Title>
                <Dialog.Content>{children}</Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onCancel}>Cancel</Button>
                    <Button onPress={onConfirmation}>OK</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default ReactNativeConfirmationDialog;
