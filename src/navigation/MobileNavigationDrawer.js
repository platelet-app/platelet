import React, { useState } from "react";
import NavDrawerItems from "./NavDrawerItems";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import makeStyles from "@mui/styles/makeStyles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Stack, SwipeableDrawer } from "@mui/material";

const useStyles = makeStyles({
    list: {
        width: 250,
    },
});

export default function MobileNavigationDrawer() {
    const [open, setOpen] = useState(false);
    const classes = useStyles();

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
        <div>
            <IconButton onClick={toggleDrawer} color="inherit" size="large">
                <MenuIcon />
            </IconButton>
            <SwipeableDrawer
                anchor={"left"}
                open={open}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
            >
                <Stack
                    direction="column"
                    alignItems="flex-end"
                    justifyContent="center"
                >
                    <IconButton>
                        <ArrowBackIcon onClick={() => toggleDrawer(false)} />
                    </IconButton>
                    <NavDrawerItems
                        className={classes.list}
                        onSelect={() => setOpen(false)}
                    />
                </Stack>
            </SwipeableDrawer>
        </div>
    );
}
