import React, {useState} from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import NavDrawerItems from "./NavDrawerItems";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import {makeStyles} from "@mui/material/styles";

const useStyles = makeStyles({
    list: {
        width: 250,
    },
});

export default function MobileNavigationDrawer() {
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const toggleDrawer = (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(!open)
    };


    return (
        <div>
            <IconButton onClick={toggleDrawer}
                        color="inherit"
            >
                <MenuIcon/>
            </IconButton>
            <SwipeableDrawer
                anchor={"left"}
                open={open}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
            >
                <NavDrawerItems
                    className={classes.list}
                    onSelect={() => setOpen(false)}
                />
            </SwipeableDrawer>
        </div>
    );
}
