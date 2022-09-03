import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

export function getThemePreference() {
    return localStorage.getItem("themeMode") || null;
}

export default function useCurrentTheme() {
    const [theme, setTheme] = useState("light");
    //const themePreference = useSelector((state) => state.darkMode);
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    useEffect(() => {
        if (prefersDarkMode) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    }, [prefersDarkMode]);
    console.log(theme);
    return theme;
}
