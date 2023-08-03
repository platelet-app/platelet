import * as React from "react";
import clearAmplifyConfig from "../../utilities/clearAmplifyConfig";
import configureAmplify from "./utilities/configureAmplify";
import saveAmplifyConfig from "../../utilities/saveAmplifyConfig";
import TenantList from "./components/TenantList";
import { Box, CircularProgress } from "@mui/material";

type TenantListProviderProps = {
    children: React.ReactNode;
};

export const TenantListProvider: React.FC<TenantListProviderProps> = ({
    children,
}) => {
    const [isProcessing, setIsProcessing] = React.useState(true);
    const [showList, setShowList] = React.useState(false);

    const offline =
        process.env.REACT_APP_OFFLINE_ONLY &&
        process.env.REACT_APP_OFFLINE_ONLY === "true";

    const handleListSetup = React.useCallback(() => {
        setShowList(false);
        setIsProcessing(false);
    }, []);

    const setup = React.useCallback(async () => {
        if (offline) return;
        setIsProcessing(true);
        const tenantId = localStorage.getItem("tenantId");
        try {
            if (
                (!process.env.REACT_APP_OFFLINE_ONLY ||
                    process.env.REACT_APP_OFFLINE_ONLY === "false") &&
                (!process.env.REACT_APP_DEMO_MODE ||
                    process.env.REACT_APP_DEMO_MODE === "false") &&
                (!process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT ||
                    // amplify doesn't allow unset env vars for individual branches
                    process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT ===
                        "undefined")
            ) {
                const config = require("../../aws-exports");
                configureAmplify(config.default);
                setIsProcessing(false);
            } else if (tenantId) {
                console.log("tenantId", tenantId);
                const config = await saveAmplifyConfig(tenantId);
                configureAmplify(config);
                setIsProcessing(false);
            } else {
                setIsProcessing(false);
                setShowList(true);
            }
        } catch (error) {
            console.log("couldn't get tenant info:", error);
            clearAmplifyConfig();
            setIsProcessing(false);
            setShowList(true);
        }
    }, [offline]);

    React.useEffect(() => {
        setup();
    }, [setup]);

    if (offline) {
        return <>{children}</>;
    } else if (isProcessing) {
        return (
            <Box sx={{ display: "flex" }}>
                <CircularProgress />
            </Box>
        );
    } else if (showList) {
        return <TenantList onComplete={handleListSetup} />;
    } else {
        return <>{children}</>;
    }
};

export default TenantListProvider;
