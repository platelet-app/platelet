export function convertListDataToObjects(list) {
    const result = {};
    for (const item of list) {
        result[item.id] = item;
    }
    return result;
}

export function setDarkModePreference(preference = false) {
    localStorage.setItem("themeMode", preference ? "dark" : "light");
}

export function getDarkModePreference() {
    const preference = localStorage.getItem("themeMode") || "false";
    return preference === "dark";
}
