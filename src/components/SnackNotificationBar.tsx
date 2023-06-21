import React from "react";
import { notificationsSelector } from "../redux/Selectors";
import { SnackbarProvider, withSnackbar } from "notistack";
import SnackNotificationButtons from "./SnackNotificationButtons";
import { useSelector } from "react-redux";

const SnackNotificationBar: React.FC<SnackbarProvider> = ({
    closeSnackbar,
    enqueueSnackbar,
}) => {
    const incomingNotification = useSelector(notificationsSelector);
    const showNotification = React.useCallback(() => {
        if (incomingNotification) {
            const { message, options, restoreCallback, viewLink } =
                incomingNotification;
            options.action = (key: number) => (
                <SnackNotificationButtons
                    restoreCallback={restoreCallback}
                    viewLink={viewLink}
                    snackKey={key}
                    closeSnackbar={closeSnackbar}
                />
            );
            enqueueSnackbar(message, options);
        }
    }, [enqueueSnackbar, closeSnackbar, incomingNotification]);
    React.useEffect(() => showNotification(), [showNotification]);
    return null;
};

export default withSnackbar(SnackNotificationBar);
