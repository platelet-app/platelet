import React, {useState} from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import NavDrawerItems from "./NavDrawerItems";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from "@material-ui/core/styles";

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
