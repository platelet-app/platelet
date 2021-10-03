import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useDispatch, useSelector } from "react-redux";
import { SwipeableDrawer } from "@material-ui/core";
import ActionsRecord from "../../ActionsRecord/ActionsRecord";
import { getTasksActionsRecordRequest } from "../../../redux/actionsRecord/ActionsRecordActions";
import Typography from "@material-ui/core/Typography";
import { getWhoami } from "../../../redux/Selectors";

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
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
    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const whoami = useSelector(getWhoami);
    const actionsRecord = useSelector(
        (state) => state.tasksActionsRecord.actionsRecord
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <main
                className={clsx(classes.content, {
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
                    <IconButton onClick={props.handleDrawerClose}>
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
                <ActionsRecord taskLinks={true} actions={actionsRecord} />
            </SwipeableDrawer>
        </div>
    );
}
