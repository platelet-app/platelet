import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
    dataStoreModelSyncedStatusSelector,
    networkStatusSelector,
} from "../../redux/Selectors";
import LoadingSpinner from "../../components/LoadingSpinner";
import ResyncDataStoreButton from "./ResyncDataStoreButton";

function SyncStatusCircleLoader() {
    const modelSyncStatus = useSelector(dataStoreModelSyncedStatusSelector);
    const [progress, setProgress] = React.useState(null);
    const [tooltip, setTooltip] = React.useState("Syncing data...");
    const dataStoreNetworkStatus = useSelector(networkStatusSelector);
    const [isCompleted, setIsCompleted] = React.useState(false);

    const onReset = () => {
        setIsCompleted(false);
        setProgress(0);
        setTooltip("Syncing data...");
    };

    useEffect(() => {
        const count = Object.keys(modelSyncStatus).length;
        const increment = 100 / count;
        const value = Object.values(modelSyncStatus).reduce(
            (acc, curr) => (acc += curr ? 1 : 0)
        );
        setProgress(value * increment);
    }, [modelSyncStatus]);

    useEffect(() => {
        if (Math.round(progress) === 100) {
            setTooltip("Data synced successfully");
        }
    }, [progress]);

    const onComplete = React.useCallback(() => {
        setIsCompleted(true);
    }, []);

    if (!dataStoreNetworkStatus) {
        return <></>;
    } else if (!isCompleted) {
        return (
            <LoadingSpinner
                progress={progress}
                tooltip={tooltip}
                onComplete={onComplete}
            />
        );
    } else if (process.env.REACT_APP_OFFLINE_ONLY !== "true") {
        return <ResyncDataStoreButton onClick={onReset} />;
    } else {
        return <></>;
    }
}

export default SyncStatusCircleLoader;
