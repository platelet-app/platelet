import React, { useEffect, useState } from "react";
import "../index.css";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MainWindow from "./MainWindow";
import { useDispatch, useSelector } from "react-redux";
import { Box, Hidden, Stack } from "@mui/material";
import TaskFilterTextField from "../components/TaskFilterTextfield";
import LightToggleProfileMenu from "./Components/LightToggleProfileMenu";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { clearDashboardFilter } from "../redux/dashboardFilter/DashboardFilterActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import DashboardDetailTabs from "../scenes/Dashboard/components/DashboardDetailTabs";
import MobileNavigationDrawer from "./MobileNavigationDrawer";
import {
    dashboardFilterTermSelector,
    dashboardTabIndexSelector,
    menuIndexSelector,
} from "../redux/Selectors";
import RoleViewSelect from "../scenes/Dashboard/components/RoleViewSelect";

const useStyles = makeStyles()((theme) => {
    return {
        appBarComponents: {
            margin: "auto",
            width: "100%",
            padding: 5,
            color: theme.palette.text.primary,
        },
        appBar: {
            [theme.breakpoints.up("sm")]: {
                width: "100%",
            },
            background: theme.palette.background.paper,
        },
    };
});

export function MenuMainContainer() {
    const { classes } = useStyles();
    const [searchMode, setSearchMode] = useState(false);
    const dashboardTabIndex = useSelector(dashboardTabIndexSelector);
    const menuIndex = useSelector(menuIndexSelector);
    const currentFilter = useSelector(dashboardFilterTermSelector);
    const toggleIcon = searchMode ? <ArrowBackIcon /> : <SearchIcon />;
    const dispatch = useDispatch();

    const toggleSearchMode = () => {
        if (searchMode) dispatch(clearDashboardFilter());
        setSearchMode(!searchMode);
    };

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));

    const updateSearchMode = React.useCallback(
        (currentFilter, menuIndex, isSm) => {
            if (menuIndex !== "dashboard") {
                setSearchMode(false);
                dispatch(clearDashboardFilter());
            } else if (currentFilter && isSm) {
                setSearchMode((prevState) => {
                    if (!prevState) return true;
                    else return prevState;
                });
            }
        },
        [dispatch]
    );

    useEffect(
        () => updateSearchMode(currentFilter, menuIndex, isSm),
        [currentFilter, isSm, menuIndex, updateSearchMode]
    );

    useEffect(() => {
        if (!isSm && searchMode) setSearchMode(false);
    }, [isSm, searchMode]);

    return (
        <React.Fragment>
            <AppBar
                position={isSm ? "relative" : "sticky"}
                className={classes.appBar}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className={classes.appBarComponents}
                >
                    {searchMode ? (
                        <Stack
                            sx={{ width: "100%" }}
                            direction="row"
                            alignItems="center"
                        >
                            <IconButton
                                onClick={toggleSearchMode}
                                color="inherit"
                                size="large"
                            >
                                {toggleIcon}
                            </IconButton>
                            <TaskFilterTextField />
                        </Stack>
                    ) : (
                        <>
                            <Box sx={{ paddingRight: 1 }}>
                                <MobileNavigationDrawer />
                            </Box>
                            {menuIndex === "dashboard" && (
                                <>
                                    <Hidden mdDown>
                                        <Box
                                            sx={{
                                                width: "100%",
                                                maxWidth: 1100,
                                            }}
                                        >
                                            <DashboardDetailTabs />
                                        </Box>
                                    </Hidden>
                                    <Hidden mdUp>
                                        <IconButton
                                            onClick={toggleSearchMode}
                                            color="inherit"
                                            size="large"
                                        >
                                            {toggleIcon}
                                        </IconButton>
                                    </Hidden>
                                </>
                            )}
                            {isXs &&
                                dashboardTabIndex !== 2 &&
                                menuIndex === "dashboard" && <RoleViewSelect />}
                            <LightToggleProfileMenu />
                        </>
                    )}
                </Stack>
            </AppBar>
            <MainWindow />
        </React.Fragment>
    );
}
