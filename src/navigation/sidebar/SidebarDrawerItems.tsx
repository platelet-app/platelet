import { FC } from "react";
import { useSelector } from "react-redux";
import { getWhoami } from "../../redux/Selectors";
import {
    ListItemIcon,
    ListItemText,
    List,
    ListItemButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
    SupervisorAccount,
    Dashboard,
    LocationCity,
    BarChart,
    Description,
    History,
    CalendarMonth,
    PeopleAlt,
    TwoWheeler,
} from "@mui/icons-material";
import * as models from "../../models";

export interface SidebarDrawerItemsProps {
    open?: boolean;
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
                    to="/admin"
                >
                    <ListItemIcon>
                        <SupervisorAccount />
                    </ListItemIcon>
                    {props.open ? <ListItemText primary="Admin" /> : <></>}
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
                    to="/history"
                >
                    <ListItemIcon>
                        <History />
                    </ListItemIcon>
                    {props.open ? <ListItemText primary="History" /> : <></>}
                </ListItemButton>
            );
            statisticsLink = (
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "statistics"}
                    component={Link}
                    to="/statistics"
                >
                    <ListItemIcon>
                        <BarChart />
                    </ListItemIcon>
                    {props.open ? <ListItemText primary="Statistics" /> : <></>}
                </ListItemButton>
            );
            scheduledTasksLink = (
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "scheduled"}
                    component={Link}
                    to="/scheduled"
                >
                    <ListItemIcon>
                        <CalendarMonth />
                    </ListItemIcon>
                    {props.open ? <ListItemText primary="Scheduled" /> : <></>}
                </ListItemButton>
            );
        }
    }

    return (
        <div className={props.className}>
            <List component="nav" style={{ padding: 0 }}>
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "dashboard"}
                    component={Link}
                    to="/"
                >
                    <ListItemIcon>
                        <Dashboard />
                    </ListItemIcon>
                    {props.open ? <ListItemText primary="Dashboard" /> : <></>}
                </ListItemButton>
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "users"}
                    component={Link}
                    to="/users"
                >
                    <ListItemIcon>
                        <PeopleAlt />
                    </ListItemIcon>
                    {props.open ? <ListItemText primary="Users" /> : <></>}
                </ListItemButton>
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "vehicles"}
                    component={Link}
                    to="/vehicles"
                >
                    <ListItemIcon>
                        <TwoWheeler />
                    </ListItemIcon>
                    {props.open ? <ListItemText primary="Vehicles" /> : <></>}
                </ListItemButton>
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "locations"}
                    component={Link}
                    to="/locations"
                >
                    <ListItemIcon>
                        <LocationCity />
                    </ListItemIcon>
                    {props.open ? <ListItemText primary="Locations" /> : <></>}
                </ListItemButton>
                <ListItemButton
                    onClick={onSelect}
                    selected={menuIndex === "reports"}
                    component={Link}
                    to="/reports"
                >
                    <ListItemIcon>
                        <Description />
                    </ListItemIcon>
                    {props.open ? <ListItemText primary="Reports" /> : <></>}
                </ListItemButton>
                {scheduledTasksLink}
                {statisticsLink}
                {historyLink}
                {adminLink}
            </List>
        </div>
    );
};
