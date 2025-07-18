import { FC } from "react";
import { useSelector } from "react-redux";
import { getWhoami } from "../../redux/Selectors";
import { ListItemIcon, ListItemText, Divider, List, ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import * as models from "../../models";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import HistoryIcon from "@mui/icons-material/History";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";

export interface SidebarDrawerItemsProps {
    className?: string;
    onSelect: () => void;
}

export const SidebarDrawerItems: FC<SidebarDrawerItemsProps> = (props) => {
    const whoami = useSelector(getWhoami);
    const menuIndex = useSelector<any>((state) => state.menuIndex);
    const onSelect = props.onSelect;
    let adminLink = <></>;
    let historyLink = <></>;
    let statisticsLink = <></>;
    let scheduledTasksLink = <></>;

    if (whoami.roles) {
        if (whoami.roles.includes("ADMIN")) {
            adminLink = (
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "admin"}
                    component={Link}
                    to={"/admin"}
                >
                    <ListItemIcon>
                        <SupervisorAccountIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Admin"} />
                </ListItemButton>
            );
        }
        if (
            whoami.roles.includes(models.Role.ADMIN) ||
            whoami.roles.includes(models.Role.COORDINATOR)
        ) {
            historyLink = (
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "history"}
                    component={Link}
                    to={"/history"}
                >
                    <ListItemIcon>
                        <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText primary={"History"} />
                </ListItemButton>
            );
            statisticsLink = (
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "statistics"}
                    component={Link}
                    to={"/statistics"}
                >
                    <ListItemIcon>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Statistics"} />
                </ListItemButton>
            );
            scheduledTasksLink = (
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "scheduled"}
                    component={Link}
                    to={"/scheduled"}
                >
                    <ListItemIcon>
                        <CalendarMonthIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Scheduled"} />
                </ListItemButton>
            );
        }
    }

    return (
        <div className={props.className}>
            <Divider />
            <List component="nav">
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "dashboard"}
                    component={Link}
                    to="/"
                >
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Dashboard"} />
                </ListItemButton>
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "users"}
                    component={Link}
                    to="/users"
                >
                    <ListItemIcon>
                        <PeopleAltIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Users"} />
                </ListItemButton>
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "vehicles"}
                    component={Link}
                    to="/vehicles"
                >
                    <ListItemIcon>
                        <TwoWheelerIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Vehicles"} />
                </ListItemButton>
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "locations"}
                    component={Link}
                    to="/locations"
                >
                    <ListItemIcon>
                        <LocationCityIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Locations"} />
                </ListItemButton>
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "reports"}
                    component={Link}
                    to="/reports"
                >
                    <ListItemIcon>
                        <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Reports"} />
                </ListItemButton>
                {scheduledTasksLink}
                {statisticsLink}
                {historyLink}
                {adminLink}
            </List>
        </div>
    );
}