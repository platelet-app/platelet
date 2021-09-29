import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import MotorcycleIcon from "@material-ui/icons/Motorcycle";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { Link } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import PropTypes from "prop-types";
import DashboardIcon from "@material-ui/icons/Dashboard";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import BarChartIcon from "@material-ui/icons/BarChart";
import { getWhoami } from "../redux/Selectors";

function NavDrawerItems(props) {
    const whoami = useSelector(getWhoami);
    const menuIndex = useSelector((state) => state.menuIndex);
    const onSelect = props.onSelect;
    let adminLink = <></>;

    if (whoami.roles) {
        if (whoami.roles.includes("ADMIN")) {
            adminLink = (
                <ListItem
                    onClick={onSelect}
                    selected={menuIndex === "admin"}
                    component={Link}
                    to={"/admin"}
                    button
                >
                    <ListItemIcon>
                        <SupervisorAccountIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Admin"} />
                </ListItem>
            );
        }
    }
    return (
        <div className={props.className}>
            <Divider />
            <List component="nav">
                <ListItem
                    onClick={onSelect}
                    selected={menuIndex === "dashboard"}
                    component={Link}
                    to="/dashboard"
                    button
                >
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Dashboard"} />
                </ListItem>
                <ListItem
                    onClick={onSelect}
                    selected={menuIndex === "users"}
                    component={Link}
                    to="/users"
                    button
                >
                    <ListItemIcon>
                        <PeopleAltIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Users"} />
                </ListItem>
                <ListItem
                    onClick={onSelect}
                    selected={menuIndex === "vehicles"}
                    component={Link}
                    to="/vehicles"
                    button
                >
                    <ListItemIcon>
                        <MotorcycleIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Vehicles"} />
                </ListItem>
                <ListItem
                    onClick={onSelect}
                    selected={menuIndex === "locations"}
                    component={Link}
                    to="/locations"
                    button
                >
                    <ListItemIcon>
                        <LocationCityIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Locations"} />
                </ListItem>
                <ListItem
                    onClick={onSelect}
                    selected={menuIndex === "statistics"}
                    component={Link}
                    to="/statistics"
                    button
                >
                    <ListItemIcon>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Statistics"} />
                </ListItem>
                {adminLink}
            </List>
        </div>
    );
}

NavDrawerItems.propTypes = {
    onSelect: PropTypes.func,
    className: PropTypes.string,
};

NavDrawerItems.defaultProps = {
    onSelect: () => {},
};

export default NavDrawerItems;
