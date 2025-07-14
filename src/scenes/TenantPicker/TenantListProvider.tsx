import * as React from "react";
import clearAmplifyConfig from "../../utilities/clearAmplifyConfig";
import configureAmplify from "./utilities/configureAmplify";
import saveAmplifyConfig from "../../utilities/saveAmplifyConfig";
import TenantList from "./components/TenantList";
import { DataStore } from "aws-amplify";
import Splash from "./Splash";
import { DAYS_AGO } from "../../hooks/utilities/getTasksConsts";

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
        const lastSynced = localStorage.getItem("dateLastSynced");
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - DAYS_AGO);
        if (lastSynced && new Date(lastSynced) < daysAgo) {
            console.log(
                `more than ${DAYS_AGO} days since last sync, clearing stale data from DataStore`
            );
            await DataStore.clear();
        }
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
                // only wait 3 seconds
                // and fallback to localstorage if it isn't fast enough
                const config = await saveAmplifyConfig(tenantId, 3000);
                configureAmplify(config);
                setIsProcessing(false);
            } else {
                setShowList(true);
                setIsProcessing(false);
            }
        } catch (error) {
            console.log("couldn't get tenant info:", error);
            clearAmplifyConfig();
            setShowList(true);
            setIsProcessing(false);
        }
    }, [offline]);

    React.useEffect(() => {
        setup();
    }, [setup]);

    if (offline) {
        return <>{children}</>;
    } else if (isProcessing) {
        return <Splash animate />;
    } else if (showList) {
        return <TenantList onComplete={handleListSetup} />;
    } else {
        return <>{children}</>;
    }
};

export default TenantListProvider;
