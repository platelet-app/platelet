import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {
    Toolbar,
    Hidden,
    List,
    ListItem,
    Button, Typography, Grid,
} from '@material-ui/core';
import {Image} from 'components/atoms';
import logo from '../../../../assets/images/platelet.png'
import DarkModeToggle from "../../../../views/IndexView/components/DarkModeToggle";
import {Link} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    flexGrow: {
        flexGrow: 1,
    },
    navigationContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toolbar: {
        zIndex: 999,
        maxWidth: theme.layout.contentWidth,
        width: '100%',
        margin: '0 auto',
        padding: theme.spacing(0, 2),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(0, 8),
        },
    },
    navLink: {
        '&:hover': {
            color: theme.palette.primary.dark,
        },
    },
    listItem: {
        cursor: 'pointer',
        '&:hover > .menu-item, &:hover svg': {
            color: theme.palette.primary.dark,
        },
        '&.menu-item--no-dropdown': {
            paddingRight: 0,
        },
    },
    listItemActive: {
        '&> .menu-item': {
            color: theme.palette.primary.dark,
        },
    },
    listItemText: {
        flex: '0 0 auto',
        marginRight: theme.spacing(2),
        whiteSpace: 'nowrap',
    },
    listItemButton: {
        whiteSpace: 'nowrap',
    },
    listItemIcon: {
        minWidth: 'auto',
    },
    popover: {
        padding: theme.spacing(4),
        border: theme.spacing(2),
        boxShadow: '0 0.5rem 2rem 2px rgba(116, 123, 144, 0.09)',
        minWidth: 350,
        marginTop: theme.spacing(2),
    },
    iconButton: {
        marginLeft: theme.spacing(2),
        padding: 0,
        '&:hover': {
            background: 'transparent',
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
        color: theme.palette.primary.dark,
    },
    logoContainer: {
        width: 90,
        height: 29,
        [theme.breakpoints.up('md')]: {
            width: 180,
            height: 58,
        },
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    menu: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    menuItem: {
        marginRight: theme.spacing(5),
        '&:last-child': {
            marginRight: 0,
        },
    },
    menuGroupItem: {
        paddingTop: 0,
    },
    menuGroupTitle: {
        textTransform: 'uppercase',
    },
}));

const Topbar = ({themeMode, themeToggler, onSidebarOpen, pages, className, ...rest}) => {
    const classes = useStyles();

    return (
        <Toolbar disableGutters className={classes.toolbar} {...rest}>
            <Grid container direction={"row"} alignItems={"center"} justify={"flex-start"} spacing={4}>
                <Grid item>
                    <div className={classes.logoContainer}>
                        <Link to={"/"}>
                            <Image
                                className={classes.logoImage}
                                src={logo}
                                alt="platelet"
                                lazy={false}
                            />
                        </Link>
                    </div>
                </Grid>
                <Grid item>
                    <Link to={"/"}>
                        <Typography
                            component={'a'}
                            className={clsx(classes.navLink, 'submenu-item')}
                            color="textSecondary"
                        >
                            Home
                        </Typography>
                    </Link>
                </Grid>
                <Grid item>
                    <Link to={"/about-platelet"}>
                    <Typography
                        component={'a'}
                        className={clsx(classes.navLink, 'submenu-item')}
                        color="textSecondary"
                    >
                        About Platelet
                    </Typography>
                    </Link>
                </Grid>
                <Grid item>
                    <Link to={"/about-blood-bikes"}>
                        <Typography
                            component={'a'}
                            className={clsx(classes.navLink, 'submenu-item')}
                            color="textSecondary"
                        >
                            About the blood bikes
                        </Typography>
                    </Link>
                </Grid>
            </Grid>
            <div className={classes.flexGrow}/>
            <List disablePadding className={classes.navigationContainer}>
                <ListItem className={clsx(classes.listItem, 'menu-item--no-dropdown')}>
                    <DarkModeToggle themeMode={themeMode} onClick={() => themeToggler()}/>
                </ListItem>
                <Hidden smDown>
                    <ListItem className={clsx(classes.listItem, 'menu-item--no-dropdown')}>
                        <Button
                            variant="contained"
                            style={{display: "none"}}
                            color="primary"
                            component="a"
                            href="/dashboard"
                            className={classes.listItemButton}
                        >
                            Open platelet
                        </Button>
                    </ListItem>
                </Hidden>
            </List>
        </Toolbar>
    );
};

Topbar.propTypes = {
    className: PropTypes.string,
    onSidebarOpen: PropTypes.func,
    pages: PropTypes.object.isRequired,
    themeToggler: PropTypes.func.isRequired,
    themeMode: PropTypes.string.isRequired,
};

export default Topbar;
