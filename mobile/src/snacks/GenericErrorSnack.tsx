import React from "react";
import { Portal, Snackbar } from "react-native-paper";

type GenericErrorSnackProps = {
    visible: boolean;
    onDismiss: () => void;
};

const GenericErrorSnack: React.FC<GenericErrorSnackProps> = ({
    visible,
    onDismiss,
}) => {
    return (
        <Portal>
            <Snackbar
                visible={visible}
                style={{ backgroundColor: "red" }}
                onDismiss={onDismiss}
            >
                Sorry, something went wrong
            </Snackbar>
        </Portal>
    );
};

export default GenericErrorSnack;
