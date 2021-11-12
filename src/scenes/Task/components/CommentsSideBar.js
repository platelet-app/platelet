import React from "react";
import { Divider, Drawer, Hidden, Stack, useTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useState } from "react";
import CommentsSection from "../../Comments/CommentsSection";
import TaskAssignmentsPanel from "./TaskAssignmentsPanel";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    drawer: (props) => ({
        [theme.breakpoints.up("sm")]: {
            width: props.width,
            flexShrink: 0,
        },
    }),
    appBar: (props) => ({
        [theme.breakpoints.up("sm")]: {
            width: `calc(100% - ${props.width}px)`,
            marginLeft: props.width,
        },
    }),
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
            display: "none",
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: (props) => ({
        width: props.width,
        background: theme.palette.background.default,
        padding: 10,
    }),
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function CommentsSideBar(props) {
    const classes = useStyles(props);
    return (
        <Hidden smDown implementation="css">
            <Drawer
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor={"right"}
                variant="permanent"
                open
            >
                <Stack direction={"column"} spacing={2}>
                    <TaskAssignmentsPanel taskId={props.taskId} />
                    <Divider />
                    <CommentsSection parentUUID={props.parentUUID} />
                </Stack>
            </Drawer>
        </Hidden>
    );
}
