import React, {useState, useEffect} from 'react';
import 'typeface-roboto'
import {Link, useHistory} from "react-router-dom";
import '../index.css'
import {makeStyles} from '@material-ui/core/styles';


import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import AppsIcon from '@material-ui/icons/Apps';
import HomeIcon from '@material-ui/icons/Home';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {useTheme} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Main from "../components/Main";
import {createLoadingSelector} from "../redux/selectors";
import {useDispatch, useSelector} from "react-redux";
import MenuSkeleton from "../loadingComponents/MenuSkeleton";
import MotorcycleIcon from '@material-ui/icons/Motorcycle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import {encodeUUID} from "../utilities";
import {SwipeableDrawer} from "@material-ui/core";
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
            width: `calc(100% - ${drawerWidth}px)`,
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

export function ResponsiveDrawer(props) {
    const loadingSelector = createLoadingSelector(['GET_WHOAMI']);
    const isFetching = useSelector(state => loadingSelector(state));
    const whoami = useSelector(state => state.whoami);
    const serverSettings = useSelector(state => state.serverSettings);
    const mobileView = useSelector(state => state.mobileView);
    const menuIndex = useSelector(state => state.menuIndex);
    const {container} = props;
    const classes = useStyles();
    //const rightBarClasses = rightSideBarUseStyles()
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        if (mobileView)
            setMobileOpen(!mobileOpen);
    };

    let sessionLink = <></>;
    let drawer = <MenuSkeleton/>;

    if (!isFetching) {
        if (whoami.roles.includes("coordinator") || whoami.roles.includes("admin")) {
            sessionLink =
                <ListItem onClick={handleDrawerToggle} selected={(menuIndex === 2)} component={Link} to="/sessions"
                          button>
                    <ListItemIcon><AppsIcon/></ListItemIcon>
                    <ListItemText primary={"Shifts"}/>
                </ListItem>;
        }
        drawer = (
            <div>
                <div className={classes.toolbar}/>
                <Divider/>
                <List component="nav">
                    <ListItem onClick={handleDrawerToggle} selected={(menuIndex === 1)} component={Link} to="/" button>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText primary={"Home"}/>
                    </ListItem>
                    {sessionLink}
                    <ListItem onClick={handleDrawerToggle} selected={(menuIndex === 3)} component={Link} to={"/mytasks"}
                              button>
                        <ListItemIcon><InboxIcon/></ListItemIcon>
                        <ListItemText primary={"My Assigned Tasks"}/>
                    </ListItem>
                    <ListItem onClick={handleDrawerToggle} selected={(menuIndex === 4)} component={Link} to="/vehicles"
                              button>
                        <ListItemIcon><MotorcycleIcon/></ListItemIcon>
                        <ListItemText primary={"Vehicles"}/>
                    </ListItem>
                    <ListItem onClick={handleDrawerToggle} selected={(menuIndex === 5)} component={Link} to="/users"
                              button>
                        <ListItemIcon><PeopleAltIcon/></ListItemIcon>
                        <ListItemText primary={"Users"}/>
                    </ListItem>
                </List>
            </div>
        );
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const dispatch = useDispatch();
    const history = useHistory();

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Grid container direction={"row"} spacing={1} justify={"flex-start"} alignItems={"center"}>
                        <Grid item>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                className={classes.menuButton}
                            >
                                <MenuIcon/>
                            </IconButton>

                        </Grid>
                        <Grid item>
                            <Typography variant="h6">
                                {serverSettings ? serverSettings.organisation_name : ""}
                            </Typography>
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
                                        setAnchorEl(event.currentTarget);
                                    }}>
                                    <ArrowDropDownIcon/>
                                </IconButton>
                                <Menu
                                    id="profile-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={() => {
                                        setAnchorEl(null);
                                    }}
                                >
                                    <MenuItem onClick={() => {
                                        setAnchorEl(null);
                                    }} component={Link} to={`/user/${encodeUUID(whoami.uuid)}`}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        setAnchorEl(null);
                                        dispatch(logoutUser());
                                        history.push("/");
                                    }}>
                                        Logout
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        setAnchorEl(null);
                                        dispatch(removeApiURL());
                                        dispatch(clearServerSettings());
                                        history.push("/");
                                    }}>
                                        Change Organisation
                                    </MenuItem>
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
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <SwipeableDrawer
                        container={container}
                        variant="temporary"
                        onOpen={handleDrawerToggle}
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </SwipeableDrawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <Main apiControl={props.apiControl}/>
        </div>
    );
}
