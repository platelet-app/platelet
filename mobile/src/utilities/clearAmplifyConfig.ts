import AsyncStorage from "@react-native-async-storage/async-storage";

async function clearAmplifyConfig() {
    console.log("Clearing tenant config");
    await AsyncStorage.removeItem("amplifyConfig");
    await AsyncStorage.removeItem("tenantVersion");
    await AsyncStorage.removeItem("tenantName");
}

export default clearAmplifyConfig;
