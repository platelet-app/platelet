import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
    dataStoreModelSyncedStatusSelector,
    networkStatusSelector,
} from "../../redux/Selectors";
import LoadingSpinner from "../../components/LoadingSpinner";

function SyncStatusCircleLoader() {
    const modelSyncStatus = useSelector(dataStoreModelSyncedStatusSelector);
    const [progress, setProgress] = React.useState(null);
    const [tooltip, setTooltip] = React.useState("Syncing data...");
    const dataStoreNetworkStatus = useSelector(networkStatusSelector);

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

    if (!dataStoreNetworkStatus) {
        return <></>;
    } else {
        return <LoadingSpinner progress={progress} tooltip={tooltip} />;
    }
}

export default SyncStatusCircleLoader;
