import React, {useState, useEffect} from 'react';
import 'typeface-roboto'
import {Link, useHistory} from "react-router-dom";
import '../index.css'
import {makeStyles} from '@material-ui/core/styles';


import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
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
import MenuSkeleton from "../SharedLoadingSkeletons/MenuSkeleton";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {encodeUUID} from "../utilities";
import {logoutUser, removeApiURL} from "../redux/login/LoginActions";
import {clearServerSettings} from "../redux/ServerSettings/ServerSettingsActions";

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
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: "100%",
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
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

export function MenuMainContainer(props) {
    const loadingSelector = createLoadingSelector(['GET_WHOAMI']);
    const isFetching = useSelector(state => loadingSelector(state));
    const whoami = useSelector(state => state.whoami.user);
    const serverSettings = useSelector(state => state.serverSettings);
    const classes = useStyles();
    //const rightBarClasses = rightSideBarUseStyles()
    const [anchorElProfileMenu, setAnchorElProfileMenu] = React.useState(null);
    const [anchorElDashMenu, setAnchorElDashMenu] = React.useState(null);

    let adminLink = <></>
    let dashboardMenu = <MenuSkeleton/>;

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
                {adminLink}
            </List>
        );
    }
    const dispatch = useDispatch();
    const history = useHistory();

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Grid container direction={"row"} spacing={3} justify={"flex-start"} alignItems={"center"}>
                        <Grid item>
                            <Typography variant="h6">
                                {serverSettings ? serverSettings.organisation_name : ""}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Divider orientation={"vertical"} />
                        </Grid>
                        <Grid item>
                            <Grid container direction={"row"} spacing={0} justify={"flex-start"} alignItems={"center"}>
                                <Grid item>
                                    <Typography variant="h6">
                                        <Link to={"/"} style={{ textDecoration: 'none', color: "white" }}>Dashboard</Link>
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
                            <Typography variant="h6" noWrap>
                                {whoami.display_name}
                            </Typography>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <MainWindow apiControl={props.apiControl}/>
        </div>
    );
}
