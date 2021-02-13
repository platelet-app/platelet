export function convertListDataToObjects(list) {
    const result = {};
    for (const item of list) {
        result[item.uuid] = item
    }
    return result;
}

export function setDarkModePreference(preference = false) {
    localStorage.setItem("darkModePreference", preference ? "true" : "false");
}

export function getDarkModePreference() {
    const preference = localStorage.getItem("darkModePreference") || "false";
    return preference === "true";
}
