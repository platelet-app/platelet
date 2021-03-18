import React, {useState} from 'react';
import 'typeface-roboto'
import '../index.css'
import {makeStyles, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from "@material-ui/core/Grid";
import MainWindow from "./MainWindow";
import {useDispatch} from "react-redux";
import {Hidden} from "@material-ui/core";
import TaskFilterTextField from "../components/TaskFilterTextfield";
import NavMenuSearch from "./Components/NavMenuSearch";
import LightToggleProfileMenu from "./Components/LightToggleProfileMenu";
import SearchIcon from "@material-ui/icons/Search";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {clearDashboardFilter} from "../redux/dashboardFilter/DashboardFilterActions";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles(theme => {
    const appBarBack = theme.palette.type === "dark" ? theme.palette.background.paper : theme.palette.primary.main;
    return ({
        appBarComponents: {
            margin: "auto",
            width: "100%",
            maxWidth: "1280px"
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                width: "100%",
            },
            background: appBarBack
        },
    })
})

export function MenuMainContainer() {
    const classes = useStyles();
    const [searchMode, setSearchMode] = useState(false);
    const navMenuSearch = searchMode ? <></> : <NavMenuSearch/>;
    const lightToggleProfileMenu = searchMode ? <></> : <LightToggleProfileMenu/>;
    const toggleIcon = searchMode ? <ArrowBackIcon/> : <SearchIcon/>;
    const dispatch = useDispatch();

    const toggleSearchMode = () => {
        if (searchMode)
            dispatch(clearDashboardFilter())
        setSearchMode(!searchMode);
    }

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"))

    return (
        <React.Fragment>
            <AppBar position={isSm ? "relative": "sticky"} className={classes.appBar}>
                <Toolbar className={classes.appBarComponents}>
                    <Grid container justify={"space-between"}>
                        <Grid item>
                            {navMenuSearch}
                        </Grid>
                        <Grid item>
                            <Hidden mdUp>
                                <Grid container item alignItems={"center"} direction={"row"}>
                                    <Grid item>
                                        <IconButton onClick={toggleSearchMode}
                                                    color="inherit"
                                        >
                                            {toggleIcon}
                                        </IconButton>
                                    </Grid>
                                    <Grid item>
                                        {searchMode ? <TaskFilterTextField/> : <></>}
                                    </Grid>
                                </Grid>
                            </Hidden>
                        </Grid>
                        <Grid item>
                            {lightToggleProfileMenu}
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <MainWindow/>
        </React.Fragment>
    );
}
