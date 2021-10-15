import React from "react";
import { Drawer, Hidden, makeStyles, useTheme } from "@mui/material";
import { useState } from "react";
import CommentsSection from "../../Comments/CommentsSection";

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
    const { window } = props;
    const classes = useStyles(props);
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const [open, setOpen] = useState(true);
    const container =
        window !== undefined ? () => window().document.body : undefined;

    const toggleDrawer = (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setOpen(!open);
    };

    return (
        <>
            <Hidden smUp implementation="css">
                <Drawer
                    container={container}
                    variant="temporary"
                    anchor={"right"}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    commentsMob
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor={"right"}
                    variant="permanent"
                    open
                >
                    <CommentsSection parentUUID={props.parentUUID} />
                </Drawer>
            </Hidden>
        </>
    );
}
