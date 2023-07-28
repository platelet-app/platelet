import * as React from "react";
import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

export function getThemePreference() {
    return localStorage.getItem("themeMode") || null;
}

export default function useCurrentTheme() {
    const [theme, setTheme] = useState("light");
    //const themePreference = useSelector((state) => state.darkMode);
    let prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const getDarkModePreference = React.useCallback(async () => {
        if (window.cordova) {
            window.cordova.plugins.ThemeDetection.isDarkModeEnabled(
                (result) => {
                    if (result.value) {
                        setTheme("dark");
                    } else {
                        setTheme("light");
                    }
                },
                (error) => {
                    setTheme("light");
                    console.log(error);
                }
            );
        } else {
            if (prefersDarkMode) {
                setTheme("dark");
            } else {
                setTheme("light");
            }
        }
    }, [prefersDarkMode]);
    useEffect(() => {
        getDarkModePreference();
    }, [getDarkModePreference]);
    return theme;
}
