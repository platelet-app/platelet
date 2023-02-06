import React from "react";
import { useSelector } from "react-redux";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import * as models from "../models";
import List from "@mui/material/List";
import PropTypes from "prop-types";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import { getWhoami } from "../redux/Selectors";

function NavDrawerItems(props) {
    const whoami = useSelector(getWhoami);
    const menuIndex = useSelector((state) => state.menuIndex);
    const onSelect = props.onSelect;
    let adminLink = <></>;
    let statisticsLink = <></>;

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
        if (
            whoami.roles.includes(models.Role.ADMIN) ||
            whoami.roles.includes(models.Role.COORDINATOR)
        ) {
            statisticsLink = (
                <ListItem
                    onClick={onSelect}
                    selected={menuIndex === "statistics"}
                    component={Link}
                    to={"/statistics"}
                    button
                >
                    <ListItemIcon>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Statistics"} />
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
                    to="/"
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
                        <TwoWheelerIcon />
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
                    selected={menuIndex === "reports"}
                    component={Link}
                    to="/reports"
                    button
                >
                    <ListItemIcon>
                        <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Reports"} />
                </ListItem>
                {statisticsLink}
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
