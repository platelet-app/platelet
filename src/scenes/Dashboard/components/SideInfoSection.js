import React from "react";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from 'tss-react/mui';
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSelector } from "react-redux";
import { SwipeableDrawer } from "@mui/material";
import ActionsRecord from "../../ActionsRecord/ActionsRecord";
import Typography from "@mui/material/Typography";

const drawerWidth = 400;

const useStyles = makeStyles()((theme) => ({
    root: {
        display: "flex",
    },
    title: {
        flexGrow: 1,
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    drawerHeaderTitle: {
        fontStyle: "italic",
    },
    content: {
        flexGrow: 1,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
}));

export default function SideInfoSection(props) {
    const { classes, cx } = useStyles();
    const theme = useTheme();
    return (
        <div className={classes.root}>
            <CssBaseline />
            <main
                className={cx(classes.content, {
                    [classes.contentShift]: props.open,
                })}
            >
                <div className={classes.drawerHeader} />
                {props.children}
            </main>
            <SwipeableDrawer
                className={classes.drawer}
                variant="persistent"
                onOpen={props.handleDrawerToggle}
                onClose={props.handleDrawerToggle}
                anchor="right"
                open={props.open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={props.handleDrawerClose} size="large">
                        {theme.direction === "rtl" ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                        <Typography className={classes.drawerHeaderTitle}>
                            Recent Activity
                        </Typography>
                    </IconButton>
                </div>
                <Divider />
                <ActionsRecord taskLinks={true} actions={[]} />
            </SwipeableDrawer>
        </div>
    );
}
