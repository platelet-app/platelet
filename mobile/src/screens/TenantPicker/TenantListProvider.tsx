import * as React from "react";
import clearAmplifyConfig from "../../utilities/clearAmplifyConfig";
import configureAmplify from "./utilities/configureAmplify";
import saveAmplifyConfig from "../../utilities/saveAmplifyConfig";
import TenantList from "./components/TenantList";
import { useColorScheme, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TenantListProviderProps = {
    children?: React.ReactNode;
};

const log = (...args: string[]) => {
    console.log("[TenantListProvider]:", ...args);
};

export const TenantListProvider: React.FC<TenantListProviderProps> = ({
    children,
}) => {
    const [isProcessing, setIsProcessing] = React.useState(true);
    const [showList, setShowList] = React.useState(false);
    const colorScheme = useColorScheme();

    const handleListSetup = React.useCallback(() => {
        setShowList(false);
        setIsProcessing(false);
    }, []);

    const setup = React.useCallback(async () => {
        setIsProcessing(true);
        try {
            const tenantId = await AsyncStorage.getItem("tenantId");
            if (!process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT) {
                const config = require("../../aws-exports");
                configureAmplify(config.default);
                setIsProcessing(false);
            } else if (tenantId) {
                log(`tenantId: ${tenantId}`);
                const config = await saveAmplifyConfig(tenantId);
                configureAmplify(config);
                setIsProcessing(false);
            } else {
                setIsProcessing(false);
                setShowList(true);
            }
        } catch (error) {
            if (error instanceof Error) {
                log("couldn't get tenant info", error.message);
            }
            await clearAmplifyConfig();
            setIsProcessing(false);
            setShowList(true);
        }
    }, []);

    React.useEffect(() => {
        setup();
    }, [setup]);

    if (isProcessing) {
        return (
            <View
                style={{
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                    backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
                }}
            >
                <ActivityIndicator animating={true} />
            </View>
        );
    } else if (showList) {
        return <TenantList onComplete={handleListSetup} />;
    } else {
        return <>{children}</>;
    }
};

export default TenantListProvider;
