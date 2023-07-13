function clearAmplifyConfig() {
    console.log("Clearing tenant config");
    localStorage.removeItem("amplifyConfig");
    localStorage.removeItem("tenantVersion");
    localStorage.removeItem("tenantName");
}

export default clearAmplifyConfig;
