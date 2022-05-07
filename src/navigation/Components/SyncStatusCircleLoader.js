import React, { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import {
    dataStoreModelSyncedStatusSelector,
    networkStatusSelector,
} from "../../redux/Selectors";

function SyncStatusCircleLoader() {
    const modelSyncStatus = useSelector(dataStoreModelSyncedStatusSelector);
    const [progress, setProgress] = React.useState(0);
    const [completed, setCompleted] = React.useState(false);
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
            setTimeout(() => setCompleted(true), 1000);
        }
    }, [progress]);

    useEffect(() => console.log(modelSyncStatus), [modelSyncStatus]);

    if (completed || !dataStoreNetworkStatus) {
        return <></>;
    } else {
        return <CircularProgress variant="determinate" value={progress} />;
    }
}

export default SyncStatusCircleLoader;
