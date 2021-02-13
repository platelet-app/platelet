import React from 'react';
import 'typeface-roboto'
import {Link, useHistory} from "react-router-dom";
import '../index.css'
import {makeStyles} from '@material-ui/core/styles';


import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import MainWindow from "./MainWindow";
import {createLoadingSelector} from "../redux/selectors";
import {useDispatch, useSelector} from "react-redux";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {encodeUUID} from "../utilities";
import {logoutUser, removeApiURL} from "../redux/login/LoginActions";
import {clearServerSettings} from "../redux/ServerSettings/ServerSettingsActions";
import UserAvatar from "../components/UserAvatar";
import {setDarkMode} from "../redux/Actions";
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import {Tooltip} from "@material-ui/core";

const drawerWidth = 240;

const rightSideBarUseStyles = makeStyles(theme => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    },
}));

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBarComponents: {
        margin: "auto",
        width: "1280px"
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: "100%",
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export function MenuMainContainer() {
    const loadingSelector = createLoadingSelector(['GET_WHOAMI']);
    const isFetching = useSelector(state => loadingSelector(state));
    const whoami = useSelector(state => state.whoami.user);
    const serverSettings = useSelector(state => state.serverSettings);
    const darkMode = useSelector(state => state.darkMode)
    const classes = useStyles();
    //const rightBarClasses = rightSideBarUseStyles()
    const [anchorElProfileMenu, setAnchorElProfileMenu] = React.useState(null);
    const [anchorElDashMenu, setAnchorElDashMenu] = React.useState(null);

    let adminLink = <></>;
    let dashboardMenu = <List/>;

    if (!isFetching) {
        if (whoami.roles) {
            if (whoami.roles.includes("admin")) {
                adminLink =
                    <MenuItem onClick={() => {
                        setAnchorElDashMenu(null);
                    }} component={Link} to={"/admin"}>
                        Admin
                    </MenuItem>
            }
        }
        dashboardMenu = (
            <List component="nav">
                <MenuItem onClick={() => {
                    setAnchorElDashMenu(null);
                }} component={Link} to={"/users"}>
                    Users
                </MenuItem>
                <MenuItem onClick={() => {
                    setAnchorElDashMenu(null);
                }} component={Link} to={"/vehicles"}>
                    Vehicles
                </MenuItem>
                <MenuItem onClick={() => {
                    setAnchorElDashMenu(null);
                }} component={Link} to={"/locations"}>
                    Locations
                </MenuItem>
                <MenuItem onClick={() => {
                    setAnchorElDashMenu(null);
                }} component={Link} to={"/statistics"}>
                    Statistics
                </MenuItem>
                {adminLink}
            </List>
        );
    }
    const dispatch = useDispatch();
    const history = useHistory();

    return (
        <React.Fragment>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.appBarComponents}>
                    <Grid container direction={"row"} spacing={3} justify={"flex-start"} alignItems={"center"}>
                        <Grid item>
                            <Typography variant="h6">
                                {serverSettings ? serverSettings.organisation_name : ""}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Divider orientation={"vertical"}/>
                        </Grid>
                        <Grid item>
                            <Grid container direction={"row"} spacing={0} justify={"flex-start"} alignItems={"center"}>
                                <Grid item>
                                    <Typography variant="h6">
                                        <Link to={"/"} style={{textDecoration: 'none', color: "white"}}>Dashboard</Link>
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        color="inherit"
                                        aria-controls="simple-menu"
                                        aria-haspopup="true"
                                        onClick={(event) => {
                                            setAnchorElDashMenu(event.currentTarget);
                                        }}>
                                        <ArrowDropDownIcon/>
                                    </IconButton>
                                    <Menu
                                        id="dasboard-menu"
                                        anchorEl={anchorElDashMenu}
                                        keepMounted
                                        open={Boolean(anchorElDashMenu)}
                                        onClose={() => {
                                            setAnchorElDashMenu(null);
                                        }}
                                    >
                                        {dashboardMenu}
                                    </Menu>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container direction={"row-reverse"} justify={"flex-start"} alignItems={"center"}>
                        <Grid item>
                            <div>
                                <IconButton
                                    color="inherit"
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={(event) => {
                                        setAnchorElProfileMenu(event.currentTarget);
                                    }}>
                                    <ArrowDropDownIcon/>
                                </IconButton>
                                <Menu
                                    id="profile-menu"
                                    anchorEl={anchorElProfileMenu}
                                    keepMounted
                                    open={Boolean(anchorElProfileMenu)}
                                    onClose={() => {
                                        setAnchorElProfileMenu(null);
                                    }}
                                >
                                    <MenuItem onClick={() => {
                                        setAnchorElProfileMenu(null);
                                    }} component={Link} to={`/user/${encodeUUID(whoami.uuid)}`}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        setAnchorElProfileMenu(null);
                                        dispatch(logoutUser());
                                        history.push("/");
                                    }}>
                                        Logout
                                    </MenuItem>

                                    {process.env.REACT_APP_API_URL ? "" :
                                        // No need for change organisation entry if the api url is hard coded
                                        <MenuItem onClick={() => {
                                            setAnchorElProfileMenu(null);
                                            dispatch(removeApiURL());
                                            dispatch(clearServerSettings());
                                            history.push("/");
                                        }}>
                                            Change Organisation
                                        </MenuItem>
                                    }
                                </Menu>
                            </div>
                        </Grid>
                        <Grid item>
                            <Grid container direction={"row"} justify={"flex-start"} alignItems={"center"} spacing={1}>

                                <Grid item>
                                    <Tooltip title={"Toggle dark/light mode"}>
                                        <IconButton onClick={() => {
                                            dispatch(setDarkMode(!darkMode))
                                        }}>
                                            {darkMode ? <BrightnessHighIcon/> : <Brightness4Icon/>}

                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Link to={`/user/${encodeUUID(whoami.uuid)}`}
                                          style={{textDecoration: 'none', color: "white"}}>
                                        <Typography variant="h6" noWrap>
                                            {whoami.display_name}
                                        </Typography>
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link to={`/user/${encodeUUID(whoami.uuid)}`}
                                          style={{textDecoration: 'none'}}>
                                        <UserAvatar userUUID={whoami.uuid} displayName={whoami.display_name}
                                                    avatarURL={whoami.profile_picture_thumbnail_url}/>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <MainWindow/>
        </React.Fragment>
    );
}
