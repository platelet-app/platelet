import React, {useState, useEffect} from 'react';
import 'typeface-roboto'
import {Link} from "react-router-dom";
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
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Switch from "@material-ui/core/Switch";
import {setKanbanMode} from "../redux/Actions";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const drawerWidth = 240;

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
    const kanbanMode = useSelector(state => state.kanbanMode);
    const {container} = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const mobileView = !useMediaQuery(theme.breakpoints.up('sm'));
    const dispatch = useDispatch();

    const handleDrawerToggle = () => {
        if (mobileView)
            setMobileOpen(!mobileOpen);
    };

    let sessionLink = <></>;
    let drawer = <MenuSkeleton/>;

    if (!isFetching) {
        if (whoami.roles.includes("coordinator") || whoami.roles.includes("admin")) {
            sessionLink =
                <ListItem onClick={handleDrawerToggle}  component={Link} to="/sessions" button>
                    <ListItemIcon><AppsIcon/></ListItemIcon>
                    <ListItemText primary={"Sessions"}/>
                </ListItem>;
        }
        drawer = (
            <div>
                <div className={classes.toolbar}/>
                <Divider/>
                <List component="nav">
                    <ListItem onClick={handleDrawerToggle} component={Link} to="/" button>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText primary={"Home"}/>
                    </ListItem>
                    {sessionLink}
                    <ListItem onClick={handleDrawerToggle}  component={Link} to={"/mytasks"} button>
                        <ListItemIcon><InboxIcon/></ListItemIcon>
                        <ListItemText primary={"My Tasks"}/>
                    </ListItem>
                    <ListItem onClick={handleDrawerToggle}  component={Link} to="/vehicles" button>
                        <ListItemIcon><MotorcycleIcon/></ListItemIcon>
                        <ListItemText primary={"Vehicles"}/>
                    </ListItem>
                </List>
            </div>
        );
    }
    const [anchorEl, setAnchorEl] = React.useState(null);

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Grid container direction={"row-reverse"} justify={"right"} alignItems={"center"}>
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
                                    }} component={Link} to="/profile">
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        setAnchorEl(null);
                                    }} component={Link} to="/logout">
                                        Logout
                                    </MenuItem>
                                    <MenuItem>
                                    <FormControl component="fieldset">
                                        <FormControlLabel control={
                                            <Switch
                                                checked={kanbanMode}
                                                onChange={() => {
                                                    dispatch(setKanbanMode(!kanbanMode))
                                                }}
                                                name="kanbanSwitch"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />

                                        } label={"Kanban"} labelPlacement={"end"}/>
                                    </FormControl>
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
                    <Drawer
                        container={container}
                        variant="temporary"
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
                    </Drawer>
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