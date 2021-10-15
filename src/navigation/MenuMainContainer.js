import React, { useState } from "react";
import "typeface-roboto";
import "../index.css";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import MainWindow from "./MainWindow";
import { useDispatch } from "react-redux";
import { Hidden } from "@mui/material";
import TaskFilterTextField from "../components/TaskFilterTextfield";
import NavMenuSearch from "./Components/NavMenuSearch";
import LightToggleProfileMenu from "./Components/LightToggleProfileMenu";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { clearDashboardFilter } from "../redux/dashboardFilter/DashboardFilterActions";
import useMediaQuery from "@mui/material/useMediaQuery";

const useStyles = makeStyles((theme) => {
    const appBarBack =
        theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : theme.palette.primary.main;
    return {
        appBarComponents: {
            margin: "auto",
            width: "100%",
            maxWidth: "1280px",
        },
        appBar: {
            [theme.breakpoints.up("sm")]: {
                width: "100%",
            },
            background: appBarBack,
        },
    };
});

export function MenuMainContainer() {
    const classes = useStyles();
    const [searchMode, setSearchMode] = useState(false);
    const navMenuSearch = searchMode ? <></> : <NavMenuSearch />;
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
                <Toolbar className={classes.appBarComponents}>
                    <Grid container justifyContent={"space-between"}>
                        <Grid item>{navMenuSearch}</Grid>
                        <Grid item>
                            <Hidden mdUp>
                                <Grid
                                    container
                                    item
                                    alignItems={"center"}
                                    direction={"row"}
                                >
                                    <Grid item>
                                        <IconButton
                                            onClick={toggleSearchMode}
                                            color="inherit"
                                            size="large"
                                        >
                                            {toggleIcon}
                                        </IconButton>
                                    </Grid>
                                    <Grid item>
                                        {searchMode ? (
                                            <TaskFilterTextField />
                                        ) : (
                                            <></>
                                        )}
                                    </Grid>
                                </Grid>
                            </Hidden>
                        </Grid>
                        <Grid item>{lightToggleProfileMenu}</Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <MainWindow />
        </React.Fragment>
    );
}
