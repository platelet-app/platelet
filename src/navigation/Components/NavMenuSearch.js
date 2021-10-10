import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Hidden } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@material-ui/core/Menu";
import MobileNavigationDrawer from "../MobileNavigationDrawer";
import { useSelector } from "react-redux";
import List from "@material-ui/core/List";
import MenuItem from "@material-ui/core/MenuItem";
import { createLoadingSelector } from "../../redux/LoadingSelectors";
import { getWhoami } from "../../redux/Selectors";

function NavMenuSearch() {
    const serverSettings = useSelector((state) => state.serverSettings);
    const loadingSelector = createLoadingSelector(["GET_WHOAMI"]);
    const isFetching = useSelector((state) => loadingSelector(state));
    const whoami = useSelector(getWhoami);

    const [anchorElDashMenu, setAnchorElDashMenu] = useState(null);

    let adminLink = <></>;
    let dashboardMenu = <List />;

    if (!isFetching) {
        if (whoami.roles) {
            if (whoami.roles.includes("ADMIN")) {
                adminLink = (
                    <MenuItem
                        onClick={() => {
                            setAnchorElDashMenu(null);
                        }}
                        component={Link}
                        to={"/admin"}
                    >
                        Admin
                    </MenuItem>
                );
            }
        }
        dashboardMenu = (
            <List component="nav">
                <MenuItem
                    onClick={() => {
                        setAnchorElDashMenu(null);
                    }}
                    component={Link}
                    to={"/users"}
                >
                    Users
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setAnchorElDashMenu(null);
                    }}
                    component={Link}
                    to={"/vehicles"}
                >
                    Vehicles
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setAnchorElDashMenu(null);
                    }}
                    component={Link}
                    to={"/locations"}
                >
                    Locations
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setAnchorElDashMenu(null);
                    }}
                    component={Link}
                    to={"/statistics"}
                >
                    Statistics
                </MenuItem>
                {adminLink}
            </List>
        );
    }
    return (
        <Grid
            container
            direction={"row"}
            spacing={3}
            justify={"flex-start"}
            alignItems={"center"}
        >
            <Hidden smDown>
                <Grid item>
                    <Typography variant="h6">
                        {serverSettings ? serverSettings.organisation_name : ""}
                    </Typography>
                </Grid>
            </Hidden>
            <Grid item>
                <Hidden smDown>
                    <Grid
                        container
                        direction={"row"}
                        spacing={0}
                        justify={"flex-start"}
                        alignItems={"center"}
                    >
                        <Grid item>
                            <Typography variant="h6">
                                <Link
                                    to={"/dashboard"}
                                    style={{
                                        textDecoration: "none",
                                        color: "white",
                                    }}
                                >
                                    Dashboard
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid item>
                            <IconButton
                                color="inherit"
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={(event) => {
                                    setAnchorElDashMenu(event.currentTarget);
                                }}
                            >
                                <ArrowDropDownIcon />
                            </IconButton>
                            <Menu
                                id="dasboard-menu"
                                anchorEl={anchorElDashMenu}
                                keepMounted
                                open={Boolean(anchorElDashMenu)}
                                onClose={() => {
                                    setAnchorElDashMenu(null);
                                }}
                            >
                                {dashboardMenu}
                            </Menu>
                        </Grid>
                    </Grid>
                </Hidden>
                <Hidden mdUp>
                    <MobileNavigationDrawer />
                </Hidden>
            </Grid>
        </Grid>
    );
}

export default NavMenuSearch;
