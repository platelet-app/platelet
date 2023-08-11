import * as React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataStore } from "aws-amplify";

type LoginHeaderProps = {
    onChangeTeam?: () => void;
};

const LoginHeader: React.FC<LoginHeaderProps> = ({ onChangeTeam }) => {
    const [tenantName, setTenantName] = React.useState("");
    const getTenantName = React.useCallback(async () => {
        const tenant = await AsyncStorage.getItem("tenantName");
        if (tenant) setTenantName(tenant);
    }, []);

    React.useEffect(() => {
        getTenantName();
    }, [getTenantName]);

    const handleChangeTeam = React.useCallback(async () => {
        await AsyncStorage.clear();
        await DataStore.clear();
        if (onChangeTeam) onChangeTeam();
    }, [onChangeTeam]);

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: 16,
                paddingRight: 16,
            }}
        >
            <Text>{tenantName}</Text>
            <Button mode="contained" onPress={handleChangeTeam}>
                Change Team
            </Button>
        </View>
    );
};

export default LoginHeader;
