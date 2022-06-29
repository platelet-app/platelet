import React, { useEffect } from "react";
import { Snackbar, Button } from "@mui/material";
import * as serviceWorker from "./serviceWorker";

const ServiceWorkerUpdater = () => {
    const [showReload, setShowReload] = React.useState(false);
    const [waitingWorker, setWaitingWorker] = React.useState(null);

    const onSWUpdate = (registration) => {
        setShowReload(true);
        setWaitingWorker(registration.waiting);
    };

    useEffect(() => {
        serviceWorker.register({ onUpdate: onSWUpdate });
    }, []);

    const reloadPage = () => {
        if (waitingWorker) waitingWorker.postMessage({ type: "SKIP_WAITING" });
        setShowReload(false);
        window.location.reload();
    };

    return (
        <Snackbar
            open={showReload}
            message="A new version is available!"
            onClick={reloadPage}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            action={
                <Button color="inherit" size="small" onClick={reloadPage}>
                    Reload
                </Button>
            }
        />
    );
};

export default ServiceWorkerUpdater;
