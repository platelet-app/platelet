import React, { useState } from "react";
import "../index.css";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MainWindow from "./MainWindow";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Hidden, Stack } from "@mui/material";
import TaskFilterTextField from "../components/TaskFilterTextfield";
import LightToggleProfileMenu from "./Components/LightToggleProfileMenu";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { clearDashboardFilter } from "../redux/dashboardFilter/DashboardFilterActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DashboardDetailTabs } from "../scenes/Dashboard/components/DashboardDetailTabs";
import MobileNavigationDrawer from "./MobileNavigationDrawer";
import { menuIndexSelector } from "../redux/Selectors";

const useStyles = makeStyles((theme) => {
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
    const classes = useStyles();
    const [searchMode, setSearchMode] = useState(false);
    const menuIndex = useSelector(menuIndexSelector);
    const lightToggleProfileMenu = searchMode ? (
        <></>
    ) : (
        <LightToggleProfileMenu />
    );
    const toggleIcon = searchMode ? <ArrowBackIcon /> : <SearchIcon />;
    const dispatch = useDispatch();

    const toggleSearchMode = () => {
        if (searchMode) dispatch(clearDashboardFilter());
        setSearchMode(!searchMode);
    };

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));

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
                    <Stack sx={{ width: "100%" }} direction="row">
                        <Box sx={{ width: 140 }}>
                            <MobileNavigationDrawer />
                        </Box>
                        {menuIndex === "dashboard" && (
                            <>
                                <Hidden mdDown>
                                    <Box sx={{ width: "100%", maxWidth: 1100 }}>
                                        <DashboardDetailTabs />
                                    </Box>
                                </Hidden>
                                <Hidden mdUp>
                                    <Stack
                                        alignItems={"center"}
                                        direction={"row"}
                                    >
                                        <IconButton
                                            onClick={toggleSearchMode}
                                            color="inherit"
                                            size="large"
                                        >
                                            {toggleIcon}
                                        </IconButton>
                                        {searchMode && <TaskFilterTextField />}
                                    </Stack>
                                </Hidden>
                            </>
                        )}
                    </Stack>
                    {lightToggleProfileMenu}
                </Stack>
            </AppBar>
            <MainWindow />
        </React.Fragment>
    );
}
