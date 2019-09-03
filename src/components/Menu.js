import React from 'react';
import 'typeface-roboto'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import '../index.css'
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

const useStyles = makeStyles({
    root: {
        width: 500,
    },
});

export function Mnu() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    return (
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            className={classes.root}
        >
            <BottomNavigationAction label="Home" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Sessions" icon={<FavoriteIcon />} />
            <BottomNavigationAction to='/profile' label="Profile" icon={<LocationOnIcon />} />
        </BottomNavigation>
    );
}


export default class Menu extends React.Component {
    render() {
        return (
            <BottomNavigation>
                <nav>
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/logout'>Logout</Link></li>
                        <li><Link to='/sessions'>Sessions</Link></li>
                        <li><Link to='/profile'>My Profile</Link></li>
                    </ul>
                </nav>
            </BottomNavigation>
        )

    }
}

