import * as React from "react";
import { Portal, Snackbar } from "react-native-paper";

type CopyTextSnackProps = {
    visible: boolean;
    onDismiss: () => void;
};

const CopyTextSnack: React.FC<CopyTextSnackProps> = ({
    visible,
    onDismiss,
}) => {
    return (
        <Portal>
            <Snackbar visible={visible} onDismiss={onDismiss}>
                Text copied
            </Snackbar>
        </Portal>
    );
};

export default CopyTextSnack;
