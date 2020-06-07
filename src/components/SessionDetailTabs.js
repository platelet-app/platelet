import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export function TabPanel(props) {
    const { children, index, ...other } = props;
    const value = parseInt(props.value)

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: "rgb(240, 240, 240)",
        width: "1850px",
    },
}));

export function SessionDetailTabs(props) {
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        props.onChange(event, newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={parseInt(props.value)} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Kanban" {...a11yProps(0)} />
                    <Tab label="Table" {...a11yProps(1)} />
                    <Tab label="Statistics" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            {props.children}
        </div>
    );
}