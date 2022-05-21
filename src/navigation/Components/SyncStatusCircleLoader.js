import React, { useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import {
    dataStoreModelSyncedStatusSelector,
    networkStatusSelector,
} from "../../redux/Selectors";
import { Box } from "@mui/material";

function SyncStatusCircleLoader() {
    const modelSyncStatus = useSelector(dataStoreModelSyncedStatusSelector);
    const [progress, setProgress] = React.useState(0);
    const [completed, setCompleted] = React.useState(false);
    const [loadingColor, setLoadingColor] = React.useState("orange");
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
            setLoadingColor("lightgreen");
            setTooltip("Data synced successfully");
            setTimeout(() => setCompleted(true), 2000);
        }
    }, [progress]);

    if (completed || !dataStoreNetworkStatus) {
        return <></>;
    } else {
        return (
            <Tooltip title={tooltip}>
                <Box sx={{ display: "grid" }}>
                    <CircularProgress
                        size={40}
                        variant="determinate"
                        value={progress}
                        sx={{
                            zIndex: 2,
                            gridColumn: 1,
                            gridRow: 1,
                            color: loadingColor,
                        }}
                    />
                    {Math.round(progress) !== 100 && (
                        <CircularProgress
                            size={40}
                            sx={{
                                gridColumn: 1,
                                gridRow: 1,
                                opacity: 0.5,
                                zIndex: 1,
                            }}
                        />
                    )}
                </Box>
            </Tooltip>
        );
    }
}

export default SyncStatusCircleLoader;
